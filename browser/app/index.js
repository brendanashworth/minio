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
import 'babel-polyfill'

import './less/main.less'

import Vue from 'vue'
import VueRouter from 'vue-router'
import BootstrapVue from 'bootstrap-vue'

Vue.use(VueRouter)
Vue.use(BootstrapVue)

// This is our store, a global way of managing state in the application.
import { store } from './js/store'

// Initialize our routes.
import Login from './js/components/Login.vue'

const router = new VueRouter({
  routes: [{
    path: '/login',
    component: Login
  }]
})

const vm = new Vue({
  el: document.getElementById('root'),

  // Inject the router.
  router,

  // Inject the store.
  store
})

// This gives us a nice and pretty page loader.
// First fade it out, then hide it entirely.
setTimeout(() => {
  document.querySelector('.page-load').classList.add('pl-0')
}, 50)

setTimeout(() => {
  document.querySelector('.page-load').classList.add('pl-1')
}, 400)
