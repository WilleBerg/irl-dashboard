<script setup>
import News from './components/News.vue';
import TimeDate from './components/TimeDate.vue';
import Weather from './components/Weather.vue';
</script>

<template>
  <div class="container">
    <div class="time-container">
      <TimeDate />
      <Weather />
    </div>
    <div>
      <News />
    </div>
  </div>
</template>

<style scoped>
.time-container {
  display: flex;
  align-items: center;
  gap: 2vw;
}
.container {
}
</style>