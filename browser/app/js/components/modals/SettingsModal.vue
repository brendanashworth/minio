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
  <Modal bsSize="sm" animation={ false } show={ true }>
    <a class="close close--dark" onClick={ this.hideSettings.bind(this) }>×</a>
    <ModalHeader>
      Change Password
    </ModalHeader>
    <ModalBody>
      <div class="form-group">
        <label class="form-group__label">
          Access key
        </label>
        <input type="text"
          class="form-group__field"
          id="accessKey"
          name="accesskey"
          value={ settings.accessKey }
          onChange={ this.accessKeyChange.bind(this) }
          readonly={ settings.keysReadOnly } />
        <i class="form-group__bar"></i>
      </div>
      <div class="form-group">
        <label class="form-group__label">
          Secret key
        </label>
        <div class="form-group__wrap">
          <input type={ settings.secretKeyVisible ? "text" : "password" }
            class="form-group__field"
            id="secretKey"
            name="secretKey"
            value={ settings.secretKey }
            onChange={ this.secretKeyChange.bind(this) }
            readonly={ settings.keysReadOnly } />
          <div onClick={ this.secretKeyVisible.bind(this, !settings.secretKeyVisible) } class="form-group__addon">
            <i class={ "form-group__toggle-type" + (settings.secretKeyVisible ? " toggled" : "") }></i>
          </div>
          <i class="form-group__bar"></i>
        </div>
      </div>
    </ModalBody>
    <div class="modal-footer">
      <button class={ "btn btn--link " + (settings.keysReadOnly ? "hidden" : "") } onClick={ this.generateAuth.bind(this) }>
        Generate
      </button>
      <button class={ "btn btn--link " + (settings.keysReadOnly ? "hidden" : "") } onClick={ this.setAuth.bind(this) }>
        Update
      </button>
    </div>
  </Modal>
</template>


<script>
export default {
  name: 'SettingsModal',

  computed: {
    keys: function() {
      let accessKeyEnv = ''
      let secretKeyEnv = ''

      // Check environment variables first. They may or may not have been
      // loaded already.
      if (false && serverInfo.envVars) {
        serverInfo.envVars.forEach(envVar => {
          let keyVal = envVar.split('=')
          if (keyVal[0] == 'MINIO_ACCESS_KEY') {
            accessKeyEnv = keyVal[1]
          } else if (keyVal[0] == 'MINIO_SECRET_KEY') {
            secretKeyEnv = keyVal[1]
          }
        })
      }

      if (accessKeyEnv != '' || secretKeyEnv != '') {
        dispatch(actions.setSettings({
          accessKey: accessKeyEnv,
          secretKey: secretKeyEnv,
          keysReadOnly: true
        }))
      } else {
        web.GetAuth()
          .then(data => {
            dispatch(actions.setSettings({
              accessKey: data.accessKey,
              secretKey: data.secretKey
            }))
          })
      }
    }
  },

  methods: {
    // Handle field changes from inside the modal.
    accessKeyChange: function() {
      const {dispatch} = this.props
      dispatch(actions.setSettings({
        accessKey: e.target.value
      }))
    },

    secretKeyChange: function() {
      const {dispatch} = this.props
      dispatch(actions.setSettings({
        secretKey: e.target.value
      }))
    },

    secretKeyVisible: function(secretKeyVisible) {
      const {dispatch} = this.props
      dispatch(actions.setSettings({
        secretKeyVisible
      }))
    },

    // Save the auth params and set them.
    setAuth: function() {
      e.preventDefault()
      const {web, dispatch} = this.props

      let accessKey = document.getElementById('accessKey').value
      let secretKey = document.getElementById('secretKey').value
      web.SetAuth({
        accessKey,
        secretKey
      })
        .then(data => {
          dispatch(actions.setSettings({
            accessKey: '',
            secretKey: '',
            secretKeyVisible: false
          }))
          dispatch(actions.hideSettings())
          dispatch(actions.showAlert({
            type: 'success',
            message: 'Changed credentials'
          }))
        })
        .catch(err => {
          dispatch(actions.setSettings({
            accessKey: '',
            secretKey: '',
            secretKeyVisible: false
          }))
          dispatch(actions.hideSettings())
          dispatch(actions.showAlert({
            type: 'danger',
            message: err.message
          }))
        })
    },

    generateAuth: function() {
      e.preventDefault()
      const {dispatch} = this.props

      web.GenerateAuth()
        .then(data => {
          dispatch(actions.setSettings({
            secretKeyVisible: true
          }))
          dispatch(actions.setSettings({
            accessKey: data.accessKey,
            secretKey: data.secretKey
          }))
        })
    },

    hideSettings: function() {
      e.preventDefault()

      const {dispatch} = this.props
      dispatch(actions.hideSettings())
    }
  }
}
</script>
