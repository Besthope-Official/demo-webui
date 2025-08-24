<template>
  <header class="topnav">
    <div class="brand">Demo WebUI</div>
    <nav class="nav">
      <button :class="{active: $route.name === 'UserInfo'}" @click="go('/user-info')">基本信息</button>
  <button :class="{active: $route.name === 'UserInterest'}" @click="go('/identity')">身份与兴趣</button>
      <button :class="{active: $route.name === 'ChatPage'}" @click="go('/chat')">AI 会话</button>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'TopNav',
  methods: {
    go(path){ this.$router.push(path) }
  }
}
</script>

<style scoped>
.topnav{
  height:56px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:0 16px;
  border-bottom:1px solid #eee;
  background:#fff;
}
.nav button{
  margin-left:8px;
  padding:6px 12px;
  border:0;
  background:transparent;
  cursor:pointer;
}
.nav button.active{
  border-bottom:2px solid #42b983;
  color:#42b983;
}
.brand{font-weight:600}
</style>
