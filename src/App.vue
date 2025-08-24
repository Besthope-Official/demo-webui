<template>
  <div id="app">
    <TopNav />
    <div class="container">
      <SideBar v-if="$route.name === 'ChatPage'" class="sidebar" />
      <main class="main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import TopNav from './components/TopNav.vue'
import SideBar from './components/SideBar.vue'

export default {
  name: 'App',
  components: { TopNav, SideBar }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.container {
  display: flex;
  height: calc(100vh - 56px);
}
.sidebar {
  width: 240px;
  border-right: 1px solid #eaeaea;
}
.main {
  flex: 1;
  padding: 20px;
  overflow: auto;
}
</style>
