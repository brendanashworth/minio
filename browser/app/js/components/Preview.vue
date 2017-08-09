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
  <aside class="preview" v-bind:class="{ 'preview--toggled': previewStatus.display }">
    <div class="preview__header">
      <span class="preview__label">{{ previewStatus.object }}</span>
      <i class="preview__close zmdi zmdi-long-arrow-left" v-on:click="hidePreview" />
    </div>
    <div class="preview__body">
      <div class="preview__item preview__item--img">
        <!--<Thumbnail />-->
      </div>
      <div class="preview__info">
        <dl>
          <dt>Type</dt>
          <dd>
            JPEG Image
          </dd>
          <dt>Size</dt>
          <dd>
            1.1 MB
          </dd>
          <dt>Modified</dt>
          <dd>
            Mar 1, 2017 12:12 PM
          </dd>
          <dt>Policy</dt>
          <dd>
            Read and Write
          </dd>
          <dt>Shared</dt>
          <dd>
            No
          </dd>
        </dl>
      </div>
      <div class="preview__actions">
        <button class="btn btn--lg btn--primary">
          Download
        </button>
      </div>
    </div>
  </aside>
</template>

<script>
/*import Thumbnail from './Thumbnail'*/

// Preview is the side panel for previewing info about objects.
export default {
  computed: {
    previewStatus: function() {
      return this.$store.state.previewStatus
    }
  },

  methods: {
    hidePreview: function() {
      this.$store.state.previewStatus = {
        show: false,
        bucket: '',
        object: ''
      }

      this.$store.state.checkedObjects = []
    }
  }
}
</script>
