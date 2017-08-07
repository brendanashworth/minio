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

// Path is a component which shows the breadcrumb path for buckets and objects.
// TODO selectPrefix?
const Path = {
  computed: {
    path() {
      let currentPath = this.$store.state.currentPath
      if (!currentPath) return (null)

      return currentPath.split('/').map((dir, i, array) => {
        // dirPath is a list of all previous dirs.
        let dirPath = array.filter((e, index) => index <= i).join('/') + '/'

        return <span key={ i } onClick={ (e) => selectPrefix(e, dirPath) }>{ dir }</span>
      })
    }

    currentBucket() {
      return this.$store.state.currentBucket
    }
  }

  render (h) {
    return (
      <nav className="breadcrumb">
        <span onClick={ (e) => selectPrefix(e, '') }>{ currentBucket }</span>
        { path }
      </nav>
    )
  }
})


import React from 'react'
import connect from 'react-redux/lib/components/connect'

let Path = ({currentBucket, currentPath, selectPrefix}) => {



}

export default connect(state => {
  return {
    currentBucket: state.currentBucket,
    currentPath: state.currentPath
  }
})(Path)
