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
  <b-modal bsSize="small" ok-title={{ okText }} cancel-title={{ cancelText }}
    v-bind:show="{ show }"
    class="modal--confirm" v-bind:class="{ baseClass }">
    <div class="modal--confirm__icon">
      <i class="zmdi" v-bind:class="{ icon }" />
    </div>
    <div class="modal--confirm__text">
      {{ text }}
    </div>
    <div class="modal--confirm__sub">
      {{ sub }}
    </div>
  </b-modal>
</template>


<script>
export default {
  name: 'ConfirmModal',

  props: ['cancelText', 'cancel', 'okText', 'ok', 'sub', 'text', 'icon', 'show']
}
</script>
