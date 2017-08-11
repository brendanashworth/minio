<!--
 ! Minio Cloud Storage (C) 2017 Minio, Inc.
 !
 ! Licensed under the Apache License, Version 2.0 (the "License");
 ! you may not use this file except in compliance with the License.
 ! You may obtain a copy of the License at
 !
 !     http://www.apache.org/licenses/LICENSE-2.0
 !
 ! Unless required by applicable law or agreed to in writing, software
 ! distributed under the License is distributed on an "AS IS" BASIS,
 ! WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ! See the License for the specific language governing permissions and
 ! limitations under the License.
 !-->

<template>
  <section class="browser__inner">
  <!-- TODO can only show one alert, then close, cannot reopen, must keep state -->
    <alert dismissable :type="alert.type" class='animated' v-bind:class="{ fadeInDown: alert.show, fadeOutUp: !alert.show }">
       <div class='text-center'>
         {{ alert.message }}
       </div>
     </alert>

    <section class='content' v-bind:class="{ 'content--toggled': sideBarActive }">
      <header class="header">
        <div class="toolbar">
          <div class="actions">
            <button class="zmdi zmdi-menu" v-on:click="toggleSidebar" />
            <button class="zmdi zmdi-view-comfy" />
            <button v-on:click="promptDeleteObjects" v-bind:disabled="checkedObjects.length == 0" class="zmdi zmdi-delete" />
            <button v-on:click="shareObject" v-bind:disabled="checkedObjects.length != 1" class="zmdi zmdi-share" />
            <button v-on:click="downloadSelected" v-bind:disabled="checkedObjects.length == 0" class="zmdi zmdi-download" />
          </div>

          <browser-dropdown v-if="isLoggedIn" />
          <a v-else class="btn btn-danger" href='/minio/login'>Login</a>
        </div>

        <breadcrumb-path />
      </header>

      <side-bar />

      <div class="objects">
        <header class="objects__row" data-type="folder">
          <div class="objects__item objects__item--name" v-on:click="sortObjectsByName" data-sort="name">
            Name
            <i class="objects__item__sort zmdi" v-bind:class="{ 'zmdi-sort-desc': sortNameOrder, 'zmdi-sort-asc': !sortNameOrder }" />
          </div>
          <div class="objects__item objects__item--size" v-on:click="sortObjectsBySize" data-sort="size">
            Size
            <i class="objects__item__sort zmdi" v-bind:class="{ 'zmdi-sort-amount-desc': sortSizeOrder, 'zmdi-sort-amount-asc': !sortSizeOrder }" />
          </div>
          <div class="objects__item objects__item--modified" v-on:click="sortObjectsByDate" data-sort="last-modified">
            Last Modified
            <i class="objects__item__sort zmdi" v-bind:class="{ 'zmdi-sort-amount-desc': sortDateOrder, 'zmdi-sort-amount-asc': !sortDateOrder }" />
          </div>
        </header>
        <div class="objects__container">
          <!--<Dropzone>-
            <InfiniteScroll loadMore={ this.listObjects.bind(this) }
              hasMore={ istruncated }
              useWindow={ true }
              initialLoad={ false }>-->
              <objects-list />
            <!--</InfiniteScroll>
            <div class="text-center" style={ { display: (istruncated && currentBucket) ? 'block' : 'none' } }>
              <span>Loading...</span>
            </div>
          <!-</Dropzone>-->
        </div>
      </div>

      <object-preview />

      <upload-modal />

      <dropdown v-if="isLoggedIn" class="create-new dropup">
        <button slot="dropdown-button" class="dropdown-toggle btn btn-default create-new__toggle">
          <i class="zmdi zmdi-plus"></i>
        </button>
        <ul slot="dropdown-menu" class="dropdown-menu">
          <tooltip placement="top" content="Upload File">
            <a href="#" class="create-new__btn create-new__btn--upload">
              <input type="file" @change="uploadFile" id="object-upload-input" />
              <label htmlFor="object-upload-input"> </label>
            </a>
          </tooltip>
          <tooltip placement="top" content="Make Bucket">
            <a href="#" class="create-new__btn create-new__btn--bucket" v-on:click="showMakeBucketModal"></a>
          </tooltip>
          <tooltip placement="top" content="Upload Folder">
            <a href="#" class="create-new__btn create-new__btn--folder"></a>
          </tooltip>
        </ul>
      </dropdown>

      <!--<Modal class="create-bucket"
        bsSize="small"
        animation={ false }
        show={ showMakeBucketModal }
        onHide={ this.hideMakeBucketModal.bind(this) }>
        <ModalBody>
          <form v-on:submit="makeBucket">
            <div class="form-group">
              <label class="form-group__label">
                Create new bucket
              </label>
              <input class="form-group__field"
                type="text"
                ref="makeBucketRef"
                placeholder="e.g documents"
                autoFocus/>
              <i class="form-group__bar" />
            </div>
            <div class="text-right">
              <input type="submit" class="btn btn--link" value="Create" />
              <button class="btn btn--link" v-on:click="hideMakeBucketModal">
                Cancel
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>-->

      <about-modal />

      <!--<share-modal ref="share_modal" />-->

      <settings-modal />

      <policy-modal />

      <confirm-delete-modal ref="delete_modal"
        v-if="showDeleteConfirmation"
        :objects="checkedObjects"
        @ok="deleteObjects" />

      <div class="sidebar-backdrop" v-bind:class="{ 'sidebar-backdrop--toggled': sideBarActive }" v-on:click="hideSidebar" />
    </section>
  </section>
</template>

<script>
import storage from 'local-storage-fallback'

import { alert, dropdown, tooltip } from 'vue-strap'

import Path from './Path.vue'
import BrowserDropdown from './BrowserDropdown.vue'
import Preview from './Preview.vue'
import ObjectsList from './ObjectsList.vue'
import SideBar from './SideBar.vue'

import ConfirmDeleteModal from './modals/ConfirmDeleteModal.vue'
import UploadModal from './modals/UploadModal.vue'
import SettingsModal from './modals/SettingsModal.vue'
import AboutModal from './modals/AboutModal.vue'
import ShareModal from './modals/ShareModal.vue'
import PolicyModal from './modals/PolicyModal.vue'

/*import Dropzone from '../components/Dropzone'*/

import * as utils from '../utils'
import * as mime from '../mime'
import { minioBrowserPrefix } from '../constants'

import { mapState } from 'vuex'

/*
import CopyToClipboard from 'react-copy-to-clipboard'
import InfiniteScroll from 'react-infinite-scroller';
*/

import logoInvert from '../../img/logo-dark.svg'

export default {
  name: 'Browse',

  components: {
    'alert': alert,
    'dropdown': dropdown,
    'tooltip': tooltip,
    'breadcrumb-path': Path,
    'browser-dropdown': BrowserDropdown,
    'object-preview': Preview,
    'objects-list': ObjectsList,
    'side-bar': SideBar,
    'confirm-delete-modal': ConfirmDeleteModal,
    'upload-modal': UploadModal,
    'settings-modal': SettingsModal,
    'about-modal': AboutModal,
    'share-modal': ShareModal,
    'policy-modal': PolicyModal
  },

  computed: Object.assign({
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn
    },
  }, mapState({
    alert: state => state.alert,

    checkedObjects: state => state.checkedObjects,

    sideBarActive: state => state.sideBarActive,

    sortNameOrder: state => state.sortNameOrder,
    sortSizeOrder: state => state.sortSizeOrder,
    sortDateOrder: state => state.sortDateOrder,

    policies: state => state.policies,

    currentBucket: state => state.currentBucket,

    showDeleteConfirmation: state => state.showDeleteConfirmation
  })),

  methods: {
    componentWillUnmount: function() {
      this.history()
    },

    listObjects: function() {
      const {dispatch} = this.props
      dispatch(actions.listObjects())
    },

    makeBucket: function() {
      const bucketName = this.$refs.makeBucketRef.value
      this.$refs.makeBucketRef.value = ''

      const web = this.$store.state.web

      this.hideMakeBucketModal()

      web.MakeBucket({
        bucketName
      })
        .then(() => {
          this.$store.state.commit('addBucket', bucketName)
        })
        .catch(err => this.$store.state.dispatch('error', err))
    },

    hideMakeBucketModal: function() {
      const {dispatch} = this.props
      dispatch(actions.hideMakeBucketModal())
    },

    showMakeBucketModal: function(e) {
      e.preventDefault()
      const {dispatch} = this.props
      dispatch(actions.showMakeBucketModal())
    },

    showBucketPolicy: function(e) {
      e.preventDefault()
      const {dispatch} = this.props
      dispatch(actions.showBucketPolicy())
    },

    hideBucketPolicy: function(e) {
      e.preventDefault()
      const {dispatch} = this.props
      dispatch(actions.hideBucketPolicy())
    },

    uploadFile: function(e) {
      e.preventDefault()
      const {dispatch, buckets} = this.props

      if (buckets.length === 0) {
        dispatch(actions.showAlert({
          type: 'danger',
          message: "Bucket needs to be created before trying to upload files."
        }))
        return
      }
      let file = e.target.files[0]
      e.target.value = null
      this.xhr = new XMLHttpRequest()
      dispatch(actions.uploadFile(file, this.xhr))
    },

    deleteObjects: function() {
      const {web, currentPath, currentBucket, deleteConfirmation, checkedObjects} = this.$store.state

      let objects = []
      if (checkedObjects.length > 0) {
        objects = checkedObjects.map(obj => `${currentPath}${obj}`)
      } else {
        objects = [deleteConfirmation.object]
      }

      web.RemoveObject({
        bucketname: currentBucket,
        objects: objects
      })
        .then(() => {
          for (let object of objects) {
            let name = object.replace(currentPath, '')

            this.$store.commit('removeObject', name)
          }
        })
        .catch(err => this.$store.dispatch('error', err))
    },

    promptDeleteObjects: function() {
      this.$store.state.showDeleteConfirmation = true
    },

    hideAlert: function(e) {
      e.preventDefault()
      const {dispatch} = this.props
      dispatch(actions.hideAlert())
    },

    shareObject: function(e, object) {
      e.preventDefault()
      const {dispatch} = this.props
      // let expiry = 5 * 24 * 60 * 60 // 5 days expiry by default
      dispatch(actions.shareObject(object, 5, 0, 0))
    },

    hideShareObjectModal: function() {
      const {dispatch} = this.props
      dispatch(actions.hideShareObject())
    },

    sortObjectsByName: function(e) {
      const {dispatch, objects, sortNameOrder} = this.props
      dispatch(actions.setObjects(utils.sortObjectsByName(objects, !sortNameOrder)))
      dispatch(actions.setSortNameOrder(!sortNameOrder))
    },

    sortObjectsBySize: function() {
      const {dispatch, objects, sortSizeOrder} = this.props
      dispatch(actions.setObjects(utils.sortObjectsBySize(objects, !sortSizeOrder)))
      dispatch(actions.setSortSizeOrder(!sortSizeOrder))
    },

    sortObjectsByDate: function() {
      const {dispatch, objects, sortDateOrder} = this.props
      dispatch(actions.setObjects(utils.sortObjectsByDate(objects, !sortDateOrder)))
      dispatch(actions.setSortDateOrder(!sortDateOrder))
    },

    toggleSidebar: function() {
      const old = this.$store.state.sideBarActive

      this.$store.state.sideBarActive = !old
    },

    hideSidebar: function(event) {
      // TODO
      let e = event || window.event;

      // Support all browsers.
      let target = e.srcElement || e.target;
      if (target.nodeType === 3) // Safari support.
        target = target.parentNode;

      let targetID = target.id;
      if (!(targetID === 'feh-trigger')) {
        this.props.dispatch(actions.setSidebarStatus(false))
      }
    },

    showMessage: function() {
      // TODO
      const {dispatch} = this.props
      dispatch(actions.showAlert({
        type: 'success',
        message: 'Link copied to clipboard!'
      }))

      this.$refs.share_modal.hide()
    },

    selectTexts: function() {
      this.refs.copyTextInput.select()
    },

    downloadSelected: function() {
      // TODO
      const {dispatch, web} = this.props
      let req = {
        bucketName: this.props.currentBucket,
        objects: this.props.checkedObjects,
        prefix: this.props.currentPath
      }

      web.CreateURLToken()
        .then(res => {
          let requestUrl = location.origin + "/minio/zip?token=" + res.token

          this.xhr = new XMLHttpRequest()
          dispatch(actions.downloadSelected(requestUrl, req, this.xhr))
        })
        .catch(err => dispatch(actions.showAlert({
          type: 'danger',
          message: err.message
        })))
    },

    renderold: function() {
      // TODO
      /*
      } else {
        if (prefixWritable)
          createButton = <Dropdown dropup class="create-new" id="dropdown-create-new">
                           <Dropdown.Toggle noCaret class="create-new__toggle">
                             <i class="zmdi zmdi-times"></i>
                           </Dropdown.Toggle>
                           <Dropdown.Menu>
                             <a href="#" class="create-new__btn create-new__btn--upload">
                               <input type="file" onChange={ this.uploadFile.bind(this) } id="object-upload-input" />
                               <label htmlFor="object-upload-input"> </label>
                             </a>
                           </Dropdown.Menu>
                         </Dropdown>
      }
      */
    }
  }
}
</script>
