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
  <confirm-modal @ok="okHandler"
    icon="zmdi-alert-polygon c-red"
    sub="This cannot be undone!"
    :text="confirmText"
    okText="Delete"
    cancelText="Cancel" />
</template>

<script>
import ConfirmModal from './ConfirmModal.vue'

export default {
  name: 'ConfirmDeleteModal',

  components: {
    'confirm-modal': ConfirmModal
  },

  props: ['objects'],

  computed: {
    confirmText: function() {
      let files = this.objects.length + ' file'

      // Ah, plurals.
      if (this.objects.length > 1)
        files += 's'

      return `Are you sure you want to delete ${files}?`
    }
  },

  methods: {
    okHandler: function() {
      this.$emit('ok')
    }
  }
}
</script>
