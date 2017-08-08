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
    <div v-for="object in objects" class="objects__row" v-bind:class="{ 'objects__row--folder': object.isFolder, 'fesl-loading': object.isLoading, 'objects__row-selected': object.isChecked }" v-on:click="showObjectPreview(object.name)">
      <div class="objects__item objects__item--select" data-object-type={{ object.type }}>
        <div class="checkbox">
          <input type="checkbox"
            name={{ object.name }}
            checked={{ object.isChecked }}
            v-on:change="checkObject(object.name)" />
          <i class="checkbox__helper" />
        </div>
      </div>
      <div class="objects__item objects__item--name">
        <a href="" v-on:click="selectPrefix(object.path)" }>
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
import humanize from 'humanize'

import MaterialDesignIconicFonts from 'material-design-iconic-font/dist/css/material-design-iconic-font.min.css'

import mime from '../mime'

export default {
  computed: {
    objects: function() {
      const objects = this.$store.state.objects
      const checkedObjects = this.$store.state.checkedObjects

      return objects.map((object, i) => {
        // Gives data about each object.
        let size = object.name.endsWith('/') ? '' : humanize.filesize(object.size)
        let lastModified = object.name.endsWith('/') ? '' : Moment(object.lastModified).format('lll')
        let path = currentPath + object.name
        let type = mime.getDataType(object.name, object.contentType)

        let isLoading = (loadPath === path)
        let isChecked = (checkedObjects.indexOf(object.name) != -1)
        let isFolder = (type == 'folder')

        return {
          size,
          lastModified,
          path,
          type,
          isLoading,
          isChecked,
          isFolder
        }
      })
    }
  },

  methods: {
    selectPrefix: function() {
      // TODO
    },

    checkObject: function() {
      // TODO
    },

    showObjectPreview: function(objectName) {
      const bucket = this.$store.state.currentBucket
    }
  }
}
</script>
