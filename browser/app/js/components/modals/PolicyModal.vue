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
  <modal class="policy" :value="shown" title="Bucket Policy">
    <small class="modal-header__sub">({{ currentBucket }})</small>
    <div class="policy__body">
      <policy-input />
      <policy-view v-for="policy in policies" :key="policy.prefix" :prefix="policy.prefix" :policy="policy.policy" />
    </div>
  </modal>
</template>


<script>
import { modal } from 'vue-strap'
import { mapState } from 'vuex'

import PolicyView from '../policy/PolicyView.vue'
import PolicyInput from '../policy/PolicyInput.vue'

export default {
  name: 'PolicyModal',

  components: {
    'policy-view': PolicyView,
    'policy-input': PolicyInput,
    'modal': modal
  },

  data: function() {
    return {
      shown: false
    }
  },

  computed: mapState({
    currentBucket: state => state.currentBucket,
    policies: state => state.policies
  }),

  methods: {
    hide: function() {
      this.shown = false
    },

    load: function() {
      const { currentBucket, web } = this.$store.state

      web.ListAllBucketPolicies({
        bucketName: currentBucket
      }).then(res => {
        if (!res.policies)
          return

        this.$store.commit('setPolicies', res.policies)
      }).catch(err => this.$store.dispatch('error', err))
    }
  },

  created() {
    this.load()
  }
}
</script>
