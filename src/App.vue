<script setup>
import TimeDate from './components/TimeDate.vue';
import Weather from './components/Weather.vue';
</script>

<template>
  <div class="time-container">
    <TimeDate />
    <Weather />
  </div>
</template>

<style scoped>
.time-container {
  display: flex;
  align-items: center;
  gap: 20vw;
}
</style>