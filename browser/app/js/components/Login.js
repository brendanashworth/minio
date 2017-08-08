/*
 * Minio Cloud Storage (C) 2016 Minio, Inc.
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

import classNames from 'classnames'
import logo from '../../img/logo.svg'

export const Login = {
  methods: {
    hideAlert: function(state) {
      state.commit('setAlert', null)
    },

    submit: function(state) {
      const {web, dispatch, loginRedirectPath} = this.props

      let accessKey = document.getElementById('accessKey').value
      let secretKey = document.getElementById('secretKey').value

      if (!secretKey) {
        return state.dispatch('showAlert', {
          type: 'danger',
          message: 'Secret key cannot be empty.'
        })
      } else if (!accessKey) {
        return state.dispatch('showAlert', {
          type: 'danger',
          message: 'Access key cannot be empty.'
        })
      }

      web.Login({
        username: accessKey,
        password: secretKey
      })
        .then((res) => {
          this.context.router.push(loginRedirectPath)
        })
        .catch(e => {
          state.dispatch('showAlert', {
            type: 'danger',
            message: e.message
          })
        })
    }
  },

  template: '<h1>Hello world!</h1>',
/*
  render: function(h) {
    return (<h1>HELLO WORLD</h1>)

    const {alert} = this.props
    let alertBox = (
      <b-alert className={ 'alert animated ' + (alert.show ? 'fadeInDown' : 'fadeOutUp') } variant={ alert.type } onClick={ this.hideAlert }>
        <div className='text-center'>
          { alert.message }
        </div>
      </b-alert>
    )

    // Make sure you don't show a fading out alert box on the initial web-page load.
    if (!alert.message)
      alertBox = ''

    return (
      <section className="login">
        { alertBox }
        <div className="login__content">
          <form className="login__form" onSubmit={ this.submit }>
            <div className="form-group form-group--invert">
              <input className="form-group__field text-center"
                type="text"
                placeholder="Access Key"
                id="accessKey" />
              <i className="form-group__bar" />
            </div>
            <div className="form-group form-group--invert">
              <input className="form-group__field text-center"
                type="password"
                placeholder="Secret Key"
                id="secretKey" />
              <i className="form-group__bar" />
            </div>
            <button className="login__submit" type="submit"></button>
          </form>
        </div>
        <div className="login__footer">
          <div className="login__host">
            { window.location.host }
          </div>
          <img className="login__logo" src={ logo } alt="" />
        </div>
      </section>
    )
  }*/
}
