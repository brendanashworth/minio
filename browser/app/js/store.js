/*
 * Minio Cloud Storage (C) 2017 Minio, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { minioBrowserPrefix } from './constants'

import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

// This store is our global state manager.
export const store = new Vuex.Store({
  // Only allow state to be mutated in a mutation handler.
  /* strict: true, */

  // This is our default state.
  state: {
    web: null,
    buckets: [],
    objects: [],
    istruncated: true,
    serverInfo: {},
    currentBucket: '',
    currentPath: '',
    showMakeBucketModal: false,
    uploads: {},
    alert: {
      show: false,
      type: 'danger',
      message: ''
    },
    loginError: false,
    sortNameOrder: false,
    sortSizeOrder: false,
    sortDateOrder: false,
    latestUiVersion: currentUiVersion,
    sideBarActive: false,
    loginRedirectPath: minioBrowserPrefix,
    settings: {
      accessKey: '',
      secretKey: '',
      secretKeyVisible: false
    },
    showSettings: false,
    policies: [],
    deleteConfirmation: {
      object: '',
      show: false
    },
    shareObject: {
      url: '',
      object: ''
    },
    prefixWritable: false,
    checkedObjects: [],
    previewStatus: {
      display: false,
      bucket: '',
      object: ''
    }
  },


  // Getters are computed based on the state.
  getters: {
    // Technically this is computed off of local storage, but that's synchronous.
    isLoggedIn: state => {
      // web can be null
      if (!state.web)
        return false

      return state.web.LoggedIn()
    }
  },


  // Mutations synchronously change the app state.
  mutations: {
    selectBucket(state, { bucket, prefix }) {
      prefix = prefix || ''

      let currentBucket = state.currentBucket

      if (currentBucket !== bucket)
        state.commit('setLoadBucket', bucket)

      state.commit('setCurrentBucket', bucket)
      state.dispatch('selectPrefix', prefix)
    },

    addBucket(state, bucket) {
      state.buckets = [bucket].concat(state.buckets)
    },

    setBuckets(state, buckets) {
      state.buckets = buckets
    },

    // Adds objects into the object list.
    appendObjects(state, {objects, marker, istruncated}) {
      newState.objects = state.objects.concat(objects)
      newState.marker = marker
      newState.istruncated = istruncated
    },

    // Resets the object list to empty.
    resetObjects(state) {
      state.objects = []
      state.marker = ''
      state.istruncated = false
    },

    // Remove a single object from the object list.
    removeObject(state, object) {
      let index = state.objects.indexOf(object)

      state.objects = state.objects.filter((e, i) => i != index)
    },

    // Add a checked object.
    addCheckedObject(state, object) {
      state.checkedObjects.push(object)
    },

    // Remove a checked object.
    removeCheckedObject(state, object) {
      let index = state.checkedObjects.indexOf(object)

      state.checkedObjects = state.checkedObjects.filter((e, i) => i != index)
    },

    setServerInfo(state, info) {
      state.serverInfo = info
    },

    // Set the alert modal status.
    setAlert(state, alert) {
      state.alert = alert
    },

    addUpload(state, upload) {
      upload = Object.assign({loaded: 0}, upload)

      state.uploads = Object.assign({[upload.slug]: upload}, state.uploads)
    },

    // Set the progress of a single upload slug.
    setUploadProgress(state, {slug, progress}) {
      state.uploads[slug].loaded = progress

      state.uploads = Object.assign({}, state.uploads)
    },

    removeUpload(state, slug) {
      delete state.uploads[slug]

      state.uploads = Object.assign({}, state.uploads)
    }
  },


  // Actions are asynchronous state-changing events.
  actions: {
    // error is a shorthand for showAlert() with an Error type.
    error(context, err) {
      context.dispatch('showAlert', {
        type: 'danger',
        message: err.message
      })
    },

    // showAlert triggers an alert that will automatically close if it is
    // a non-error.
    showAlert(context, alert) {
      if (alert.type !== 'danger') {
        var alertTimeout = setTimeout(() => {
          // Clear the alert.
          context.commit('setAlert', {
            show: false
          })
        }, 5000)
      }

      // Set the alert with extra fields (show, timeout).
      context.commit('setAlert', Object.assign({
        show: true,
        alertTimeout
      }, alert))
    },

    uploadFile(file, xhr) {
      // TODO implement
    },

    shareObject: function(object, days, hours, minutes) {
      const state = this.$store.state

      const web = state.web
      const host = location.host
      const bucket = state.currentBucket

      if (!web || !web.LoggedIn()) {
        state.shareObject = { object, url: `${host}/${bucket}/${object}` }
        return
      }

      let expiry = days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60
      web.PresignedGet({
        host,
        bucket,
        object,
        expiry
      })
        .then(obj => {
          state.shareObject = { object, url: obj.url }

          state.dispatch('showAlert', {
            type: 'success',
            message: `Object shared. Expires in ${days} days, ${hours} hours, and ${minutes} minutes.`
          })
        })
        .catch(err => state.dispatch('error', err))
    },

    loadBuckets: function(context, fallback) {
      if (!context.getters.isLoggedIn) {
        // If we aren't logged in, we'll get a fallback bucket to list. This
        // allows a user to specify a read-only (etc) bucket to browse without
        // having access credentials.

        context.commit('setBuckets', [fallback])
        // TODO dispatch(actions.selectBucket(obj.bucket, obj.prefix))
        return
      }

      context.state.web.ListBuckets()
        .then(res => {
          if (!res.buckets)
            return

          const buckets = res.buckets.map(bucket => bucket.name)

          context.commit('setBuckets', buckets)
        })
        .catch(err => context.dispatch('error', err))
    }
  }
})

/*
export const selectPrefix = prefix => {
  return (dispatch, getState) => {
    const {currentBucket, web} = getState()
    dispatch(resetObjects())
    dispatch(setLoadPath(prefix))
    web.ListObjects({
      bucketName: currentBucket,
      prefix,
      marker: ""
    })
      .then(res => {
        let objects = res.objects
        if (!objects)
          objects = []
        objects = objects.map(object => {
          object.name = object.name.replace(`${prefix}`, '');
          return object
        })
        dispatch(appendObjects(
          objects,
          res.nextmarker,
          res.istruncated
        ))
        dispatch(setPrefixWritable(res.writable))
        dispatch(setSortNameOrder(false))
        dispatch(setCurrentPath(prefix))
        dispatch(setLoadBucket(''))
        dispatch(setLoadPath(''))
      })
      .catch(err => {
        dispatch(showAlert({
          type: 'danger',
          message: err.message
        }))
        dispatch(setLoadBucket(''))
        dispatch(setLoadPath(''))
        // Use browserHistory.replace instead of push so that browser back button works fine.
        browserHistory.replace(`${minioBrowserPrefix}/login`)
      })
  }
}

export const downloadSelected = (url, req, xhr) => {
  return (dispatch) => {
    var anchor = document.createElement('a')
    document.body.appendChild(anchor);
    xhr.open('POST', url, true)
    xhr.responseType = 'blob'

    xhr.onload = function(e) {
      if (this.status == 200) {
        dispatch(checkedObjectsReset())
        var blob = new Blob([this.response], {
          type: 'octet/stream'
        })
        var blobUrl = window.URL.createObjectURL(blob);
        var separator = req.prefix.length > 1 ? '-' : ''

        anchor.href = blobUrl
        anchor.download = req.bucketName + separator + req.prefix.slice(0, -1) + '.zip';




        anchor.click()
        window.URL.revokeObjectURL(blobUrl)
        anchor.remove()
      }
    };
    xhr.send(JSON.stringify(req));
  }
}

export const uploadFile = (file, xhr) => {
  return (dispatch, getState) => {
    const {currentBucket, currentPath} = getState()
    const objectName = `${currentPath}${file.name}`
    const uploadUrl = `${window.location.origin}/minio/upload/${currentBucket}/${objectName}`
    // The slug is a unique identifer for the file upload.
    const slug = `${currentBucket}-${currentPath}-${file.name}`

    xhr.open('PUT', uploadUrl, true)
    xhr.withCredentials = false
    const token = storage.getItem('token')
    if (token) xhr.setRequestHeader("Authorization", 'Bearer ' + storage.getItem('token'))
    xhr.setRequestHeader('x-amz-date', Moment().utc().format('YYYYMMDDTHHmmss') + 'Z')
    dispatch(addUpload({
      slug,
      xhr,
      size: file.size,
      name: file.name
    }))

    xhr.onload = function(event) {
      if (xhr.status == 401 || xhr.status == 403 || xhr.status == 500) {
        setShowAbortModal(false)
        dispatch(stopUpload({
          slug
        }))
        dispatch(showAlert({
          type: 'danger',
          message: 'Unauthorized request.'
        }))
      }
      if (xhr.status == 200) {
        setShowAbortModal(false)
        dispatch(stopUpload({
          slug
        }))
        dispatch(showAlert({
          type: 'success',
          message: 'File \'' + file.name + '\' uploaded successfully.'
        }))
        dispatch(selectPrefix(currentPath))
      }
    }

    xhr.upload.addEventListener('error', event => {
      dispatch(showAlert({
        type: 'danger',
        message: 'Error occurred uploading \'' + file.name + '\'.'
      }))
      dispatch(stopUpload({
        slug
      }))
    })

    xhr.upload.addEventListener('progress', event => {
      if (event.lengthComputable) {
        let loaded = event.loaded
        let total = event.total

        // Update the counter.
        dispatch(uploadProgress({
          slug,
          loaded
        }))
      }
    })
    xhr.send(file)
  }
}*/
