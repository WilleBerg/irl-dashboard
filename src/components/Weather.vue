<template>
  <div v-if="resp !== ''" class="weather-container">
    <div class="weather-card">
      <div class="weather-header">
        <img
          class="weather-icon"
          :src="`https://openweathermap.org/img/wn/${resp.weather[0].icon}@4x.png`"
          alt="weather icon"
        />
        <div class="weather-description">
          {{ resp.weather[0].description }}
        </div>
      </div>
      
      <div class="temperature">
        <span class="temp-value">{{ Math.round(resp.main.temp * 10) / 10 }}°C</span>
        <span class="feels-like">Feels like {{ Math.round(resp.main.feels_like * 10) / 10 }}°C</span>
      </div>
      
      <div class="weather-details">
        <div class="detail-item">
          <span class="detail-label">Humidity</span>
          <span class="detail-value">{{ resp.main.humidity }}%</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Wind</span>
          <span class="detail-value">{{ Math.round(resp.wind.speed) }} m/s</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import secrets from '../../secrets.json';

export default {
  data() {
    return {
      resp: "", // Current weather data
      forecastData: [], // 3-hour interval forecast data
      loading: false,
      error: null
    };
  },
  mounted() {
    this.fetchData();
    this.timerId = setInterval(() => {
      this.fetchData();
    }, 60000); // Refresh every minute
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const resp = await axios.get(`${secrets.weather}`);
        this.resp = resp.data;
      } catch (error) {
        console.error('Error fetching weather data: ', error);
        this.error = 'Failed to load weather data';
      } finally {
        this.loading = false;
      }
    },
  }
};
</script>

<style scoped>
.weather-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 20px 20px 20px 0;
  box-sizing: border-box;
}

.weather-card {
  width: 100%;
  max-width: 900px;
  padding: 40px;
  background-color: rgb(0, 0, 0);
  border-radius: 16px;
}

.weather-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
}

.weather-icon {
  width: 120px;
  height: 120px;
}

.weather-description {
  font-size: 32px;
  font-weight: 600;
  text-transform: capitalize;
  margin-left: 20px;
}

.temperature {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
}

.temp-value {
  font-size: 96px;
  font-weight: 700;
  line-height: 1;
}

.feels-like {
  font-size: 28px;
  margin-top: 10px;
  opacity: 0.7;
}

.weather-details {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 30px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.detail-label {
  font-size: 24px;
  opacity: 0.7;
  margin-bottom: 8px;
}

.detail-value {
  font-size: 32px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .weather-card {
    padding: 20px;
  }
  
  .weather-icon {
    width: 80px;
    height: 80px;
  }
  
  .weather-description {
    font-size: 24px;
  }
  
  .temp-value {
    font-size: 64px;
  }
  
  .feels-like {
    font-size: 20px;
  }
  
  .detail-label {
    font-size: 18px;
  }
  
  .detail-value {
    font-size: 24px;
  }

  .forecast h3 {
    font-size: 20px;
  }

  .forecast-time {
    font-size: 16px;
  }

  .forecast-temp {
    font-size: 16px;
  }

  .forecast-description {
    font-size: 12px;
  }
}
</style>