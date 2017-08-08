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
  <nav class="top-links">
    <b-dropdown right id="dropdown-top-links">
      <!--<Dropdown.Toggle noCaret>
        <span href=""><i class="zmdi zmdi-more-vert" /></span>
      </Dropdown.Toggle>-->
      <!--<Dropdown.Menu class="dropdown-menu-right">-->
        <li>
          <a v-on:click="about">About <i class="zmdi zmdi-info" /></a>
        </li>
        <li>
          <a v-on:click="settings">Settings <i class="zmdi zmdi-settings" /></a>
        </li>
        <li class="hidden-xs hidden-sm">
          <a v-on:click="fullscreen">Fullscreen <i class="zmdi zmdi-fullscreen" /></a>
        </li>
        <li>
          <a target="_blank" href="https://github.com/minio/minio">Github <i class="zmdi zmdi-github" /></a>
        </li>
        <li>
          <a target="_blank" href="https://docs.minio.io/">Documentation <i class="zmdi zmdi-assignment" /></a>
        </li>
        <li>
          <a target="_blank" href="https://slack.minio.io">Ask for help <i class="zmdi zmdi-help" /></a>
        </li>
        <li>
          <a href="" v-on:click="logout">Sign Out <i class="zmdi zmdi-sign-in" /></a>
        </li>
      <!--</Dropdown.Menu>-->
    </b-dropdown>
  </nav>
</template>

<script>
import { minioBrowserPrefix } from '../constants'

export default {
  methods: {
    about: function() {
      // TODO show About
    },

    settings: function() {
      this.$store.state.showSettings = true
    },

    fullscreen: function() {
      let el = document.documentElement

      if (el.requestFullscreen) {
        el.requestFullscreen()
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen()
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen()
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen()
      }
    },

    logout: function() {
      this.$store.state.web.Logout()

      this.$router.push(minioBrowserPrefix + '/login')
    }
  }
}
</script>
