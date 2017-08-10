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
  <div class="policy__list">
    <div class="policy__item">
      {{ newPrefix }}
    </div>
    <div class="policy__item">
      <select disabled value={{ policy }} v-on:change="changePolicy">
        <option value={ READ_ONLY }>
          Read Only
        </option>
        <option value={ WRITE_ONLY }>
          Write Only
        </option>
        <option value={ READ_WRITE }>
          Read and Write
        </option>
      </select>
    </div>
    <div class="policy__item">
      <button class="btn btn--block btn--danger" v-on:click="removePolicy">
        Remove
      </button>
    </div>
  </div>
</template>

<script>
import { READ_ONLY, WRITE_ONLY, READ_WRITE } from '../../constants'

export default {
  name: 'Policy',

  props: ['prefix', 'policy'],

  computed: {
    newPrefix: function() {
      let newPrefix = this.prefix.replace(currentBucket + '/', '')
      newPrefix = newPrefix.replace('*', '')

      if (!newPrefix)
        newPrefix = '*'
    }
  },

  methods: {
    changePolicy: function(e) {
      // TODO mutate policy
    },

    removePolicy: function(e) {
      const currentBucket = this.$store.state.currentBucket

      let newPrefix = this.prefix.replace(currentBucket + '/', '')
      newPrefix = newPrefix.replace('*', '')

      web.SetBucketPolicy({
        bucketName: currentBucket,
        prefix: newPrefix,
        policy: 'none'
      })
        .then(() => {
          this.$store.state.policies = this.props.policies.filter(policy => policy.prefix != this.prefix)
        })
        .catch(e => function() {
          this.$store.commit('setAlert', {
            type: 'danger',
            message: e.message
          })
        })
    },
  }
}
</script>
