<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div class="home">
    <h1>Vue3 H5 Demo</h1>
    <p class="counter">计数器: {{ count }}</p>
    <van-button type="primary" size="small" @click="count++">+1</van-button>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 20px;
}
.home h1 {
  font-size: 40px;
  color: #323233;
}
.counter {
  font-size: 32px;
  color: #1989fa;
}
</style>
