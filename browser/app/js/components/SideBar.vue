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
    <div className="logo">
      <img className="logo__img" src='/img/logo-dark.svg' alt="" />
      <div className="logo__title">
        <h2>Minio Browser</h2>
        <small>{{ host }}</small>
      </div>
    </div>
    <div className="buckets">
      <div className="buckets__search">
        <div className="form-group">
          <input className="form-group__field"
            type="text"
            v-on:change="searchBuckets"
            placeholder="Search Buckets..." />
          <i className="form-group__bar"></i>
        </div>
      </div>
      <ul className="buckets__list">
        <li v-for="bucket in buckets" v-bind:class="{ 'buckets__list__active': bucket.isCurrent }" v-on:click="selectBucket(bucket)">
             <div className="buckets__list__name">
               {{ bucket.name }}
             </div>
             <div className="buckets__list__actions">
               <span>{{ bucket.policy }}</span>
               <span className="buckets__list__policy" v-on:click="showPolicy">edit policy</span>
             </div>
           </li>
      </ul>
    </div>

    <div className="browser-status">
      <div className="browser-status__storage">
        <small>{{ usage.humanUsed }} of {{ usage.humanTotal }} Used</small>
        <div className="browser-status__chart">
          <div v-bind:style="{ width: usage.usedPercent }"></div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
import filesize from 'file-size'

export default {
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
      // TODO get real figures
      const total = 50 * 1024
      const free = 12.3 * 1024
      const used = total - free

      return {
        total, free, used,
        humanUsed: filesize(used).human(),
        humanTotal: filesize(total).human(),
        usedPercent: used / total
      }
    }
  },

  methods: {
    showPolicy: function() {
      // TODO
    },

    selectBucket: function() {
      // TODO
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
    }
  },

  // created is a lifecycle hook that will fire when the SideBar is created.
  created() {
    // They don't load by themselves, you know.
    this.$store.dispatch('loadBuckets')
  },
}
</script>
