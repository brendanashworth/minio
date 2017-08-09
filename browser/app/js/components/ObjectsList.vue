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
  <div>
    <div v-for="object in objects" class="objects__row" v-bind:class="{ 'objects__row--folder': object.isFolder, 'objects__row-selected': object.isChecked }" v-on:click="showObjectPreview(object.name)">
      <div class="objects__item objects__item--select" :data-object-type="object.type">
        <div class="checkbox">
          <input type="checkbox"
            :name="object.name"
            :checked="object.isChecked"
            v-on:change="checkObject(object.name)" />
          <i class="checkbox__helper" />
        </div>
      </div>
      <div class="objects__item objects__item--name">
        <a href="#" v-on:click="selectPrefix(object.path)">
          {{ object.name }}
        </a>
      </div>
      <div class="objects__item objects__item--size">
        {{ object.size }}
      </div>
      <div class="objects__item objects__item--modified">
        {{ object.lastModified }}
      </div>
    </div>
  </div>
</template>

<script>
import Moment from 'moment'
import filesize from 'file-size'

import MaterialDesignIconicFonts from 'material-design-iconic-font/dist/css/material-design-iconic-font.min.css'

//import mime from '../mime'

export default {
  name: 'ObjectsList',

  data: function() {
    return {
      rawObjects: []
    }
  },

  computed: {
    objects: function() {
      const objects = this.rawObjects
      const checkedObjects = this.$store.state.checkedObjects
      const currentPath = this.$store.state.currentPath

      return objects.map((object, i) => {
        // Gives data about each object.
        let size = object.name.endsWith('/') ? '' : filesize(object.size).human()
        let lastModified = object.name.endsWith('/') ? '' : Moment(object.lastModified).format('lll')
        let path = currentPath + object.name
        let type = 'other' // mime.getDataType(object.name, object.contentType)

        let isChecked = (checkedObjects.indexOf(object.name) != -1)
        let isFolder = (type == 'folder')

        return {
          size,
          lastModified,
          path,
          type,
          isChecked,
          isFolder,
          name: object.name
        }
      })
    }
  },

  methods: {
    selectPrefix: function(prefix) {
      const store = this.$store

      const web = store.state.web
      const currentPath = store.state.currentPath
      const currentBucket = store.state.currentBucket

      prefix = encodeURI(prefix)

      if (prefix.endsWith('/') || prefix === '') {
        // TODO what?
        if (prefix === currentPath) return
        browserHistory.push(utils.pathJoin(currentBucket, prefix))
      } else {
        // Download the selected file.
        web.CreateURLToken()
          .then(res => {
            window.location = `${window.location.origin}/minio/download/${currentBucket}/${prefix}?token=${res.token}`
          })
          .catch(err => store.dispatch('error', err))
      }
    },

    checkObject: function(object, e) {
      const isChecked = (this.$store.state.checkedObjects.indexOf(object) > -1)

      if (isChecked)
        this.$store.commit('removeCheckedObject', object)
      else
        this.$store.commit('addCheckedObject', object)
    },

    showObjectPreview: function(objectName) {
      const bucket = this.$store.state.currentBucket
    },

    loadObjects: function() {
      const store = this.$store

      const currentPath = store.state.currentPath
      const marker = store.state.marker

      store.state.web.ListObjects({
        bucketName: this.$route.params.bucket,
        prefix: currentPath,
        marker: marker
      })
        .then(res => {
          this.rawObjects = res.objects.map(object => {
            object.name = object.name.replace(currentPath, '')

            return object
          })
        })
        .catch(err => store.dispatch('error', err))
    }
  },

  // created is a lifecycle hook that will fire when the ObjectsList is created.
  created() {
    this.loadObjects()
  },

  // if the route changes, update the objects
  watch: {
    '$route': 'loadObjects'
  }
}
</script>
