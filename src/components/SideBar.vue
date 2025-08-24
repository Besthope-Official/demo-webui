<template>
  <aside class="sidebar">
    <h3>会话历史</h3>
    <ul>
      <li>会话 1</li>
      <li>会话 2</li>
      <li>会话 3</li>
    </ul>
  </aside>
</template>

<script>
export default {
  name: 'SideBar'
}
</script>

<style scoped>
.sidebar{
  padding:16px;
}
.sidebar h3{margin:0 0 8px}
.sidebar ul{padding:0;list-style:none}
.sidebar li{padding:6px 0;border-bottom:1px solid #f0f0f0}
</style>
