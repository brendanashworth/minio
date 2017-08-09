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
    <ConfirmModal v-if="showAbortModal"
      show
      baseClass='abort-upload'
      text='Abort uploads in progress?'
      icon='fa fa-info-circle mci-amber'
      sub='This cannot be undone!'
      okText='Abort'
      okIcon='fa fa-times'
      cancelText='Upload'
      cancelIcon='fa fa-cloud-upload'
      okHandler={ this.abortUploads.bind(this) }
      cancelHandler={ this.hideAbort.bind(this) }>
    </ConfirmModal>

    <div v-else class="alert alert-info progress animated fadeInUp">
      <button type="button" class="close" onClick={ this.showAbort.bind(this) }>
        <span>×</span>
      </button>
      <div class="text-center">
        <small>{ text }</small>
      </div>
      <ProgressBar now={ percent } />
      <div class="text-center">
        <small>{ humanize.filesize(totalLoaded) } ({ percent.toFixed(2) } %)</small>
      </div>
    </div>
  </div>
</template>

<script>
import humanize from 'humanize'

import ConfirmModal from './ConfirmModal.vue'

// UploadModal is a modal that handles multiple file uploads.
// During the upload, it displays a progress bar, and can transform into an
// abort modal if the user decides to abort the uploads.
export default {
  name: 'UploadModal',

  data: {
    showAbortModal: false
  },

  methods: {
    // Abort all the current uploads.
    abortUploads: function(e) {
      e.preventDefault()
      const {dispatch, uploads} = this.props

      for (var slug in uploads) {
        let upload = uploads[slug]
        upload.xhr.abort()
        dispatch(actions.stopUpload({
          slug
        }))
      }

      this.hideAbort(e)
    }

    // Show the abort modal instead of the progress modal.
    showAbort: function(e) {
      e.preventDefault()
      const {dispatch} = this.props

      dispatch(actions.setShowAbortModal(true))
    }

    // Show the progress modal instead of the abort modal.
    hideAbort: function(e) {
      e.preventDefault()
      const {dispatch} = this.props

      dispatch(actions.setShowAbortModal(false))
    }

  render() {
    const {uploads, showAbortModal} = this.props

    // Show the abort modal.

    }

    // If we don't have any files uploading, don't show anything.
    let numberUploading = Object.keys(uploads).length
    if (numberUploading == 0)
      return ( <noscript></noscript> )

    let totalLoaded = 0
    let totalSize = 0

    // Iterate over each upload, adding together the total size and that
    // which has been uploaded.
    for (var slug in uploads) {
      let upload = uploads[slug]
      totalLoaded += upload.loaded
      totalSize += upload.size
    }

    let percent = (totalLoaded / totalSize) * 100

    // If more than one: "Uploading files (5)..."
    // If only one: "Uploading myfile.txt..."
    let text = 'Uploading ' + (numberUploading == 1 ? `'${uploads[Object.keys(uploads)[0]].name}'` : `files (${numberUploading})`) + '...'

    return (

    )
  }
}
</script>
