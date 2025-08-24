<template>
  <section class="user-info">
    <h2>欢迎</h2>
    <p>请填写您的基本信息</p>

    <div class="row gender">
      <label>性别</label>
      <div class="icons">
        <button :class="{selected: form.gender==='male'}" @click="selectGender('male')">男</button>
        <button :class="{selected: form.gender==='female'}" @click="selectGender('female')">女</button>
      </div>
    </div>

    <div class="row">
      <label>姓名</label>
      <input v-model="form.name" placeholder="请输入您的姓名" />
    </div>

    <div class="row">
      <label>出生日期</label>
      <input type="date" v-model="form.birthday" />
    </div>

    <div class="row">
      <label>城市</label>
      <select v-model="form.city">
        <option value="">请选择城市</option>
        <option>北京</option>
        <option>上海</option>
        <option>广州</option>
        <option>深圳</option>
        <option>成都</option>
      </select>
    </div>

    <div class="actions">
      <button @click="next">下一步</button>
    </div>
  </section>
</template>

<script>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
export default {
  name: 'UserInfo',
  setup(){
    const router = useRouter()
    const form = reactive({ gender: '', name: '', birthday: '', city: '' })
    function selectGender(g){ form.gender = g }
    function next(){
      const data = { ...form }
      try { sessionStorage.setItem('userInfo', JSON.stringify(data)) } catch(e){ console.warn('sessionStorage set failed', e) }
      console.log('UserInfo data', data)
      router.push('/identity')
    }
    return { form, selectGender, next }
  }
}
</script>

<style scoped>
.user-info{max-width:640px;margin:24px auto}
.row{display:flex;align-items:center;margin:12px 0}
.row label{width:100px}
.icons button{margin-right:8px;padding:10px 14px;border:1px solid #ddd;background:#fff}
.icons button.selected{border-color:#42b983;background:#eaf6ef}
.actions{margin-top:24px}
</style>
