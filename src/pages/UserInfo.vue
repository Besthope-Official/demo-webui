<template>
  <section class="user-info-container">
    <div class="header">
      <h2>欢迎成为APP新的用户,</h2>
      <h2>接下来介绍一下你自己吧</h2>
    </div>

    <div class="gender-selection">
      <div class="gender-option" :class="{ selected: form.gender === 'male' }" @click="selectGender('male')">
        <div class="avatar-wrapper">
          <div class="avatar male">
            <img :src="male" alt="Male Avatar" />
          </div>
          <div class="checkmark"></div>
        </div>
        <span>男</span>
      </div>
      <div class="gender-option" :class="{ selected: form.gender === 'female' }" @click="selectGender('female')">
        <div class="avatar-wrapper">
          <div class="avatar female">
            <img :src="female" alt="Female Avatar" />
          </div>
          <div class="checkmark"></div>
        </div>
        <span>女</span>
      </div>
    </div>

    <div class="form-fields">
      <div class="input-wrapper">
        <span class="icon">👤</span>
        <input v-model="form.name" placeholder="请设置您的昵称" />
      </div>
      <!-- Date input with direct calendar popup -->
      <div class="input-wrapper" @click="openDatePicker">
        <span class="icon">📅</span>
        <input
          ref="birthdayInput"
          v-model="form.birthday"
          :type="birthdayInputType"
          @blur="onBirthdayBlur"
          placeholder="请选择您的出生年月"
        />
      </div>
      <div class="input-wrapper">
        <span class="icon">📍</span>
        <select v-model="form.city" :class="{'placeholder': !form.city}">
          <option value="" disabled>请选择您的城市</option>
          <option>北京</option>
          <option>上海</option>
          <option>广州</option>
          <option>深圳</option>
          <option>成都</option>
        </select>
      </div>
    </div>

    <div class="actions">
      <button @click="next">下一步</button>
    </div>
  </section>
</template>

<script>
import { reactive, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'

import male from '@/assets/male.svg'
import female from '@/assets/female.svg'
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

    // Logic for direct date picker
    const birthdayInput = ref(null);
    const birthdayInputType = ref('text');

    const openDatePicker = () => {
      birthdayInputType.value = 'date';
      nextTick(() => {
        if (birthdayInput.value) {
          try {
            // Modern browsers support showPicker()
            birthdayInput.value.showPicker();
          } catch (e) {
            // Fallback for older browsers
            birthdayInput.value.focus();
          }
        }
      });
    };

    const onBirthdayBlur = () => {
      // Revert to text input if no date is selected, to show placeholder
      if (!form.birthday) {
        birthdayInputType.value = 'text';
      }
    };

    return {
      form,
      selectGender,
      next,
      male,
      female,
      birthdayInput,
      birthdayInputType,
      openDatePicker,
      onBirthdayBlur
    }
  }
}
</script>

<style scoped>
.user-info-container {
  max-width: 400px;
  margin: 24px auto;
  padding: 20px;
  font-family: sans-serif;
  text-align: center;
  background-color: #ffffff;
}

.header {
  margin-bottom: 30px;
}

.header h2 {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.gender-selection {
  display: flex;
  justify-content: center;
  gap: 50px;
  margin-bottom: 30px;
}

.gender-option {
  cursor: pointer;
  text-align: center;
}

.gender-option .avatar-wrapper {
  position: relative;
  width: 70px;
  height: 70px;
  margin: 0 auto 10px auto;
}

.gender-option .avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.gender-option .avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gender-option .avatar.male {
  background-color: #e0f7fa;
}

.gender-option .avatar.female {
  background-color: #fce4ec;
}

.checkmark {
  display: none;
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #ff9800;
  color: white;
  align-items: center;
  justify-content: center;
}

.checkmark::after {
  content: '✔';
  font-size: 14px;
}

.gender-option.selected .checkmark {
  display: flex;
}

.gender-option span {
  font-size: 16px;
  color: #333;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 30px;
  padding: 12px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  cursor: text; /* Indicate it's a text input area */
}

.input-wrapper .icon {
  margin-right: 12px;
  color: #888;
  font-size: 20px;
}

.input-wrapper input,
.input-wrapper select {
  border: none;
  outline: none;
  width: 100%;
  background-color: transparent;
  font-size: 16px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  cursor: inherit; /* Inherit cursor from wrapper */
}

.input-wrapper input::placeholder {
  color: #aaa;
}

.input-wrapper select {
  color: #333; /* Default text color */
}

.input-wrapper select.placeholder {
  color: #aaa; /* Placeholder color */
}

/* For date input, prevent pointer events so the wrapper's click is always triggered */
.input-wrapper input[type="date"],
.input-wrapper input[type="text"][placeholder="请选择您的出生年月"] {
  pointer-events: none;
}


.actions button {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 30px;
  background-color: #ff9800;
  color: white;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.actions button:hover {
  background-color: #f57c00;
}
</style>