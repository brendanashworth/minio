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
  <aside class="sidebar" v-bind:class="{'sidebar--toggled': sideBarActive }">
    <div class="logo">
      <img class="logo__img" src='/minio/logo-dark.svg' alt="" />
      <div class="logo__title">
        <h2>Minio Browser</h2>
        <small>{{ host }}</small>
      </div>
    </div>
    <div class="buckets">
      <div class="buckets__search">
        <div class="form-group">
          <input class="form-group__field"
            type="text"
            v-model="searchQuery"
            placeholder="Search Buckets..." />
          <i class="form-group__bar"></i>
        </div>
      </div>
      <ul class="buckets__list">
        <li v-for="bucket in buckets" v-bind:class="{ 'buckets__list__active': bucket.isCurrent }" v-on:click="selectBucket(bucket)">
             <div class="buckets__list__name">
               {{ bucket.name }}
             </div>
             <div class="buckets__list__actions">
               <span>{{ bucket.policy }}</span>
               <span class="buckets__list__policy" v-on:click="showPolicy">edit policy</span>
             </div>
           </li>
      </ul>
    </div>

    <div class="browser-status">
      <div class="browser-status__storage">
        <small>{{ usage.humanUsed }} of {{ usage.humanTotal }} Used</small>
        <div class="browser-status__chart">
          <div v-bind:style="{ width: usage.usedPercent }"></div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
import filesize from 'file-size'

import { minioBrowserPrefix } from '../constants'

export default {
  data: function() {
    return {
      searchQuery: '',
      storage: {
        total: 0,
        free: 0
      }
    }
  },

  computed: {
    buckets: function() {
      const currentBucket = this.$store.state.currentBucket

      return this.$store.state.visibleBuckets.map(bucket => {
        // Convert it into an object with the relevant fields.
        bucket = { name: bucket }

        bucket.isCurrent = (bucket == currentBucket)
        bucket.policy = 'read and write'

        return bucket
      })
    },

    host: function() {
      return window.location.host
    },

    sideBarActive: function() {
      return this.$store.state.sideBarActive
    },

    usage: function() {
      const total = this.storage.total
      const free = this.storage.free
      const used = total - free

      return {
        total, free, used,
        humanUsed: filesize(used).human(),
        humanTotal: filesize(total).human(),
        usedPercent: ((used / total) * 100) + '%'
      }
    }
  },

  methods: {
    showPolicy: function() {
      // TODO
    },

    selectBucket: function(bucket) {
      this.$router.push(minioBrowserPrefix + '/bucket/' + bucket.name)
    },

    searchBuckets: function() {
      // TODO
    },

    deleteBucket: function(bucket) {
      // DeleteBucket() RPC call will ONLY delete a bucket if it is empty of
      // objects. This means a call can just be sent, as it is entirely reversable
      // and won't do any permanent damage.
      web.DeleteBucket({
        bucketName: bucket
      })
        .then(() => {
          dispatch(showAlert({
            type: 'info',
            message: `Bucket '${bucket}' has been deleted.`
          }))
          dispatch(removeBucket(bucket))
        })
        .catch(err => {
          let message = err.message

          // Show a custom "bucket not empty" message, as it can be confusing.
          if (/Bucket not empty/.test(err.message)) {
            message = `Bucket '${bucket}' must be empty to delete.`
          }

          dispatch(showAlert({
            type: 'danger',
            message: message
          }))
        })
    },

    loadStorageInfo: function() {
      const web = this.$store.state.web

      web.StorageInfo()
        .then(res => {
          this.storage = {
            total: res.storageInfo.Total,
            free: res.storageInfo.Free
          }
        })
        .catch(err => this.$store.dispatch('error', err))
    }
  },

  watch: {
    searchQuery: function(query) {
      this.$store.commit('filterBuckets', bucket => {
        // Simple search algorithm: if it contains our search query, show it.
        return bucket.indexOf(query) != -1
      })
    }
  },

  // created is a lifecycle hook that will fire when the SideBar is created.
  created() {
    this.$store.dispatch('loadBuckets')

    this.loadStorageInfo()
  },
}
</script>
