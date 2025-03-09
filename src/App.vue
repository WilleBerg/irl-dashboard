<script setup>
// import Bus from './components/Bus.vue';
import Forecast from './components/Forecast.vue';
import News from './components/News.vue';
import TimeDate from './components/TimeDate.vue';
import Weather from './components/Weather.vue';
</script>

<template>
  <div class="container">
    <div class="time-container">
      <div class="forecast-and-time-container">
        <TimeDate />
      </div>
      <Weather />
    </div>
    <div>
        <Forecast />
    </div>
    <div>
      <News />
    </div>
  </div>
  <!-- <div>
    <Bus />
  </div> -->
</template>

<style scoped>
.time-container {
  display: flex;
  align-items: center;
  gap: 2vw;
}
.forecast-and-time-container {
  margin: 0 0 0 5vw;
}
</style>