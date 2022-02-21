<template>
  <div class="app" v-infinity="{ callback: next, hitw: 1000 }">
    <div>
      <h1 class="header">Random User : {{ users.length }}</h1>
      <div class="user" v-for="user in users" :key="user.first">
        <div class="user-avatar">
          <img :src="user.picture.large" />
        </div>
        <div class="user-details">
          <h2 class="user-name">
            {{ user.name.first }}
            {{ user.name.last }}
          </h2>
          <ul>
            <li><strong>Birthday:</strong> {{ user.dob.date }}</li>
            <li>
              <strong>Location:</strong> {{ user.location.city }},
              {{ user.location.state }}
            </li>
          </ul>
        </div>
      </div>
      <div v-if="loading">Loading.... Please wait..</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import infinityDirective from './components/infinity.directive'
const apiUrl = 'https://randomuser.me/api/'
export default {
  directives: {
    infinity: infinityDirective,
  },
  data() {
    return {
      users: [],
      pageSIze: 10,
      loading: false,
    }
  },
  beforeMount() {
    this.load()
  },
  methods: {
    next() {
      this.load()
    },
    load() {
      this.loading = true
      axios.get(`${apiUrl}?results=${this.pageSIze}`).then(async (res) => {
        // 데이터 로딩 인디케이터를 확인하기 위한 의도적인 지연
        await new Promise((resolve) => setTimeout(() => resolve(), 2000))
        this.loading = false
        this.users = [...this.users, ...res.data.results]
      })
    },
  },
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
html,
body {
  height: 100%;
}
body {
  display: flex;
  .app {
    flex: 1;
    margin: 50px;
    overflow: auto;
  }
}
.header {
  position: fixed;
}
.user {
  display: flex;
  background: #ccc;
  border-radius: 1em;
  margin: 1em auto;
}

.user-avatar {
  padding: 1em;
}

.user-avatar img {
  display: block;
  width: 100%;
  min-width: 64px;
  height: auto;
  border-radius: 50%;
}

.user-details {
  padding: 1em;
}

.user-name {
  margin: 0;
  padding: 0;
  font-size: 2rem;
  font-weight: 900;
}
</style>
