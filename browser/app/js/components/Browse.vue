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
    <b-alert class='alert animated' v-bind:class="{ fadeInDown: alert.show, fadeOutUp: !alert.show }">
      <!-- bsStyle={ alert.type } onDismiss={ this.hideAlert.bind(this) }>-->
       <div class='text-center'>
         {{ alert.message }}
       </div>
     </b-alert>

    <section class='content' v-bind:class="{ 'content--toggled': sideBarActive }">
      <header class="header">
        <div class="toolbar">
          <div class="actions">
            <button class="zmdi zmdi-menu" v-on:click="toggleSidebar" />
            <button class="zmdi zmdi-view-comfy" />
            <button v-on:click="showDeleteConfirmation" v-bind:disabled="checkedObjects.length == 0" class="zmdi zmdi-delete" />
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

      <!--
      <Dropdown v-if="isLoggedIn" dropup class="create-new" id="dropdown-create-new">
        <Dropdown.Toggle noCaret class="create-new__toggle">
          <i class="zmdi zmdi-plus"></i>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <OverlayTrigger placement="top" overlay={ tooltips.uploadFile }>
            <a href="#" class="create-new__btn create-new__btn--upload">
              <input type="file" onChange={ this.uploadFile.bind(this) } id="object-upload-input" />
              <label htmlFor="object-upload-input"> </label>
            </a>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={ tooltips.createBucket }>
            <a href="#" class="create-new__btn create-new__btn--bucket" v-on:click="showMakeBucketModal"></a>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={ tooltips.uploadFolder }>
            <a href="#" class="create-new__btn create-new__btn--folder"></a>
          </OverlayTrigger>
        </Dropdown.Menu>
      </Dropdown>

      <Modal class="create-bucket"
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
      </Modal>

      --><about-modal /><!--

      <!--
      <Modal class="policy"
        animation={ false }
        show={ showBucketPolicy }
        onHide={ this.hideBucketPolicy.bind(this) }>
        <ModalHeader>
          Bucket Policy
          <small class="modal-header__sub">({{ currentBucket }})</small>
          <i class="close close--dark" v-on:click="hideBucketPolicy">×</i>
        </ModalHeader>
        <div class="policy__body">
          <policy-input />
          <policy-view v-for="policy in policies" :key="policy.prefix" :prefix="policy.prefix" :policy="policy.policy" />
        </div>
      </Modal>
      <confirm-modal
        icon='zmdi-alert-polygon c-red'
        text='Are you sure you want to delete?'
        sub='This cannot be undone!'
        okText='Delete'
        cancelText='Cancel'
        v-on:ok="removeObject">
      </confirm-modal>

      <share-modal ref="share_modal" />

      <settings-modal />
      -->

      <div class="sidebar-backdrop" v-bind:class="{ 'sidebar-backdrop--toggled': sideBarActive }" v-on:click="hideSidebar" />
    </section>
  </section>
</template>

<script>
import storage from 'local-storage-fallback'

import Path from './Path.vue'
import BrowserDropdown from './BrowserDropdown.vue'
import Preview from './Preview.vue'
import ObjectsList from './ObjectsList.vue'
import SideBar from './SideBar.vue'
import Policy from './Policy.vue'
import PolicyInput from './PolicyInput.vue'

import ConfirmModal from './modals/ConfirmModal.vue'
import UploadModal from './modals/UploadModal.vue'
import SettingsModal from './modals/SettingsModal.vue'
import AboutModal from './modals/AboutModal.vue'
import ShareModal from './modals/ShareModal.vue'

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
    'breadcrumb-path': Path,
    'browser-dropdown': BrowserDropdown,
    'object-preview': Preview,
    'objects-list': ObjectsList,
    'side-bar': SideBar,
    'policy-view': Policy,
    'policy-input': PolicyInput,
    'confirm-modal': ConfirmModal,
    'upload-modal': UploadModal,
    'settings-modal': SettingsModal,
    'about-modal': AboutModal,
    'share-modal': ShareModal
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

    currentBucket: state => state.currentBucket
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

    removeObject: function() {
      const {web, dispatch, currentPath, currentBucket, deleteConfirmation, checkedObjects} = this.props
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
          this.hideDeleteConfirmation()
          if (checkedObjects.length > 0) {
            for (let i = 0; i < checkedObjects.length; i++) {
              dispatch(actions.removeObject(checkedObjects[i].replace(currentPath, '')))
            }
            dispatch(actions.checkedObjectsReset())
          } else {
            let delObject = deleteConfirmation.object.replace(currentPath, '')
            dispatch(actions.removeObject(delObject))
          }
        })
        .catch(e => dispatch(actions.showAlert({
          type: 'danger',
          message: e.message
        })))
    },

    hideAlert: function(e) {
      e.preventDefault()
      const {dispatch} = this.props
      dispatch(actions.hideAlert())
    },

    showDeleteConfirmation: function(e, object) {
      e.preventDefault()
      const {dispatch} = this.props
      dispatch(actions.showDeleteConfirmation(object))
    },

    hideDeleteConfirmation: function() {
      const {dispatch} = this.props
      dispatch(actions.hideDeleteConfirmation())
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

    showPreview: function(e, bucket, object) {
      const {dispatch, previewStatus} = this.props
      dispatch(actions.setPreviewStatus(true, bucket, object))
    },

    renderold: function() {
      /*let tooltips = {
        uploadFile: <Tooltip id="tooltip-upload-file">
                      Upload File
                    </Tooltip>,
        createBucket: <Tooltip id="tooltip-create-bucket">
                        Create Bucket
                      </Tooltip>,
        uploadFolder: <Tooltip id="tooltip-upload-folder">
                        Upload Folder
                      </Tooltip>,
      }
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
<<<<<<< HEAD

    return (
      <section className="browser__inner">
        { alertBox }
        <section className={ classNames({
                               'content': true,
                               'content--toggled': sidebarStatus
                             }) }>
          <header className="header">
            <div className="toolbar">
              <div className="actions">
                <button className="zmdi zmdi-menu" onClick={ this.toggleSidebar.bind(this, !sidebarStatus) } />
                <button className="zmdi zmdi-view-comfy" />
                <button onClick={ this.showDeleteConfirmation.bind(this) } disabled={ checkedObjects.length == 0 } className="zmdi zmdi-delete" />
                { deleteButton }
                <button onClick={ this.downloadSelected.bind(this) } disabled={ checkedObjects.length == 0 } className="zmdi zmdi-download" />
              </div>
              { loginButton }
              { browserDropdownButton }
            </div>
            <Path selectPrefix={ this.selectPrefix.bind(this) } />
            <BrowserUpdate />
          </header>
          <SideBar searchBuckets={ this.searchBuckets.bind(this) }
            selectBucket={ this.selectBucket.bind(this) }
            clickOutside={ this.hideSidebar.bind(this) }
            showPolicy={ this.showBucketPolicy.bind(this) }
            deleteBucket={ this.deleteBucket.bind(this) }
            storageDetails={ storageUsageDetails } />
          <div className="objects">
            <header className="objects__row" data-type="folder">
              <div className="objects__item objects__item--name" onClick={ this.sortObjectsByName.bind(this) } data-sort="name">
                Name
                <i className={ classNames({
                                 'objects__item__sort': true,
                                 'zmdi': true,
                                 'zmdi-sort-desc': sortNameOrder,
                                 'zmdi-sort-asc': !sortNameOrder
                               }) } />
              </div>
              <div className="objects__item objects__item--size" onClick={ this.sortObjectsBySize.bind(this) } data-sort="size">
                Size
                <i className={ classNames({
                                 'objects__item__sort': true,
                                 'zmdi': true,
                                 'zmdi-sort-amount-desc': sortSizeOrder,
                                 'zmdi-sort-amount-asc': !sortSizeOrder
                               }) } />
              </div>
              <div className="objects__item objects__item--modified" onClick={ this.sortObjectsByDate.bind(this) } data-sort="last-modified">
                Last Modified
                <i className={ classNames({
                                 'objects__item__sort': true,
                                 'zmdi': true,
                                 'zmdi-sort-amount-desc': sortDateOrder,
                                 'zmdi-sort-amount-asc': !sortDateOrder
                               }) } />
              </div>
            </header>
            <div className="objects__container">
              <Dropzone>
                <InfiniteScroll loadMore={ this.listObjects.bind(this) }
                  hasMore={ istruncated }
                  useWindow={ true }
                  initialLoad={ false }>
                  <ObjectsList dataType={ this.dataType.bind(this) }
                    selectPrefix={ this.selectPrefix.bind(this) }
                    showDeleteConfirmation={ this.showDeleteConfirmation.bind(this) }
                    shareObject={ this.shareObject.bind(this) }
                    checkObject={ this.checkObject.bind(this) }
                    checkedObjectsArray={ checkedObjects }
                    currentBucket={ currentBucket }
                    showObjectPreview={ this.showPreview.bind(this) } />
                </InfiniteScroll>
                <div className="text-center" style={ { display: (istruncated && currentBucket) ? 'block' : 'none' } }>
                  <span>Loading...</span>
                </div>
              </Dropzone>
            </div>
          </div>
          <Preview />
          <UploadModal />
          { createButton }
          <Modal className="create-bucket"
            bsSize="small"
            animation={ false }
            show={ showMakeBucketModal }
            onHide={ this.hideMakeBucketModal.bind(this) }>
            <ModalBody>
              <form onSubmit={ this.makeBucket.bind(this) }>
                <div className="form-group">
                  <label className="form-group__label">
                    Create new bucket
                  </label>
                  <input className="form-group__field"
                    type="text"
                    ref="makeBucketRef"
                    placeholder="e.g documents"
                    autoFocus/>
                  <i className="form-group__bar" />
                </div>
                <div className="text-right">
                  <input type="submit" className="btn btn--link" value="Create" />
                  <button className="btn btn--link" onClick={ this.hideMakeBucketModal.bind(this) }>
                    Cancel
                  </button>
                </div>
              </form>
            </ModalBody>
          </Modal>
          <Modal animation={ false } show={ showAbout } onHide={ this.hideAbout.bind(this) }>
            <i className="close close--dark" onClick={ this.hideAbout.bind(this) }>×</i>
            <div className="about">
              <div className="about__logo">
                <img src={ logoInvert } alt="" />
              </div>
              <div className="about__content">
                <dl className="about__info">
                  <dt>Version</dt>
                  <dd>
                    { version }
                  </dd>
                  <dt>Memory</dt>
                  <dd>
                    { memory }
                  </dd>
                  <dt>Platform</dt>
                  <dd>
                    { platform }
                  </dd>
                  <dt>Runtime</dt>
                  <dd>
                    { runtime }
                  </dd>
                </dl>
              </div>
            </div>
          </Modal>
          <Modal className="policy"
            animation={ false }
            show={ showBucketPolicy }
            onHide={ this.hideBucketPolicy.bind(this) }>
            <ModalHeader>
              Bucket Policy
              <small className="modal-header__sub">({ currentBucket })</small>
              <i className="close close--dark" onClick={ this.hideBucketPolicy.bind(this) }>×</i>
            </ModalHeader>
            <div className="policy__body">
              <PolicyInput bucket={ currentBucket } />
              { policies.map((policy, i) => <Policy key={ i } prefix={ policy.prefix } policy={ policy.policy } />) }
            </div>
          </Modal>
          <ConfirmModal show={ deleteConfirmation.show }
            icon={ 'zmdi-alert-polygon c-red' }
            text='Are you sure you want to delete?'
            sub='This cannot be undone!'
            okText='Delete'
            cancelText='Cancel'
            okHandler={ this.removeObject.bind(this) }
            cancelHandler={ this.hideDeleteConfirmation.bind(this) }>
          </ConfirmModal>
          <Modal show={ shareObject.show }
            animation={ false }
            onHide={ this.hideShareObjectModal.bind(this) }
            bsSize="small">
            <ModalHeader>
              Share Object
            </ModalHeader>
            <ModalBody>
              <div className="form-group">
                <label className="form-group__label">
                  Shareable Link
                </label>
                <input className="form-group__field"
                  type="text"
                  ref="copyTextInput"
                  readOnly="readOnly"
                  value={ window.location.protocol + '//' + shareObject.url }
                  onClick={ this.selectTexts.bind(this) } />
                <i className="form-group__bar" />
              </div>
              <div className="form-group" style={ { display: web.LoggedIn() ? 'block' : 'none' } }>
                <label className="form-group__label">
                  Expires in
                </label>
                <div className="set-expire">
                  <div className="set-expire__item">
                    <i className="set-expire__increase" onClick={ this.handleExpireValue.bind(this, 'expireDays', 1, shareObject.object) }></i>
                    <div className="set-expire__title">
                      Days
                    </div>
                    <div className="set-expire__value">
                      <input ref="expireDays"
                        type="number"
                        min={ 0 }
                        max={ 7 }
                        defaultValue={ 5 } />
                    </div>
                    <i className="set-expire__decrease" onClick={ this.handleExpireValue.bind(this, 'expireDays', -1, shareObject.object) }></i>
                  </div>
                  <div className="set-expire__item">
                    <i className="set-expire__increase" onClick={ this.handleExpireValue.bind(this, 'expireHours', 1, shareObject.object) }></i>
                    <div className="set-expire__title">
                      Hours
                    </div>
                    <div className="set-expire__value">
                      <input ref="expireHours"
                        type="number"
                        min={ 0 }
                        max={ 23 }
                        defaultValue={ 0 } />
                    </div>
                    <i className="set-expire__decrease" onClick={ this.handleExpireValue.bind(this, 'expireHours', -1, shareObject.object) }></i>
                  </div>
                  <div className="set-expire__item">
                    <i className="set-expire__increase" onClick={ this.handleExpireValue.bind(this, 'expireMins', 1, shareObject.object) }></i>
                    <div className="set-expire__title">
                      Minutes
                    </div>
                    <div className="set-expire__value">
                      <input ref="expireMins"
                        type="number"
                        min={ 0 }
                        max={ 59 }
                        defaultValue={ 0 } />
                    </div>
                    <i className="set-expire__decrease" onClick={ this.handleExpireValue.bind(this, 'expireMins', -1, shareObject.object) }></i>
                  </div>
                </div>
              </div>
            </ModalBody>
            <div className="modal-footer">
              <CopyToClipboard text={ window.location.protocol + '//' + shareObject.url } onCopy={ this.showMessage.bind(this) }>
                <button className="btn btn--link">
                  Copy Link
                </button>
              </CopyToClipboard>
              <button className="btn btn--link" onClick={ this.hideShareObjectModal.bind(this) }>
                Cancel
              </button>
            </div>
          </Modal>
          { settingsModal }
          <div className={ classNames({
                             "sidebar-backdrop": true,
                             "sidebar-backdrop--toggled": sidebarStatus
                           }) } onClick={ this.hideSidebar.bind(this) } />
        </section>
      </section>
    )
=======
>>>>>>> rewrite a few components
  }
}
</script>
