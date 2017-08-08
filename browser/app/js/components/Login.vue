<!--
 !
 ! Minio Cloud Storage (C) 2016 Minio, Inc.
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
 !
 !-->

<template>
  <section class="login">
    <b-alert class="alert animated" :show="alert.show" v-bind:class="{ fadeInDown: alert.show }" v-on:click="hideAlert" :variant="alert.type">
      <div className='text-center'>
        {{ alert.message }}
      </div>
    </b-alert>

    <div class="login__content">
      <form class="login__form" v-on:submit.prevent="submit">
        <div class="form-group form-group--invert">
          <input class="form-group__field text-center"
            type="text"
            placeholder="Access Key"
            id="accessKey" />
          <i class="form-group__bar" />
        </div>
        <div class="form-group form-group--invert">
          <input class="form-group__field text-center"
            type="password"
            placeholder="Secret Key"
            id="secretKey" />
          <i class="form-group__bar" />
        </div>
        <button class="login__submit" type="submit"></button>
      </form>
    </div>
    <div class="login__footer">
      <div class="login__host">
        {{ host }}
      </div>
      <img class="login__logo" src="/img/logo.svg" alt="" />
    </div>
  </section>
</template>

<script>
export default {
  data: function() {
    return {
      host: window.location.host
    }
  },

  computed: {
    alert() {
      return this.$store.state.alert
    }
  },

  methods: {
    hideAlert: function() {
      this.$store.commit('setAlert', null)
    },

    submit: function() {
      const store = this.$store

      const accessKey = document.getElementById('accessKey').value
      const secretKey = document.getElementById('secretKey').value

      if (!secretKey) {
        return store.dispatch('showAlert', {
          type: 'danger',
          message: 'Secret key cannot be empty.'
        })
      } else if (!accessKey) {
        return store.dispatch('showAlert', {
          type: 'danger',
          message: 'Access key cannot be empty.'
        })
      }

      store.state.web.Login({
        username: accessKey,
        password: secretKey
      })
        .then((res) => {
          this.$router.push('/')
        })
        .catch(e => {
          store.dispatch('showAlert', {
            type: 'danger',
            message: e.message
          })
        })
    }
  }
}
</script>
