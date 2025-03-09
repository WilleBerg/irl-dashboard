<template>
    <div class="forecasts-outer-container">
      <div class="separator top-separator"></div>
      
      <div class="forecasts-wrapper">
        <!-- 3-Hour Interval Forecast Section -->
        <div class="forecast-container">
          <h3 class="forecast-title">3-Hour Forecast</h3>
          <div class="forecast-cards">
            <div v-for="(interval, index) in forecastData" :key="index" class="day-card">
              <p class="day-name">{{ formatTime24h(interval.dt) }}</p>
              <img 
                :src="`https://openweathermap.org/img/wn/${interval.weather[0].icon}@2x.png`" 
                :alt="interval.weather[0].description" 
                class="weather-icon" 
              />
              <div class="temp-container">
                <p class="max-temp">{{ Math.round(interval.main.temp) }}°</p>
              </div>
            </div>
          </div>
        </div>
  
        <div class="separator middle-separator"></div>
  
        <!-- 5-Day Forecast Section -->
        <div class="forecast-container">
          <h3 class="forecast-title">5-Day Forecast at 12:00</h3>
          <div class="forecast-cards">
            <div v-for="(day, index) in forecastDays" :key="index" class="day-card">
              <p class="day-name">{{ day.dayName }}</p>
              <img :src="getWeatherIcon(day.icon)" :alt="day.description" class="weather-icon" />
              <div class="temp-container">
                <p class="max-temp">{{ Math.round(day.maxTemp) }}°</p>
                <p class="temp-divider">/</p>
                <p class="min-temp">{{ Math.round(day.minTemp) }}°</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="separator bottom-separator"></div>
    </div>
  </template>
    
  <script>
  import axios from 'axios';
  import secrets from '../../secrets.json';
  
  export default {
    data() {
      return {
        forecast_data: [],
        forecastDays: [],
        forecastData: [], // 3-hour interval forecast data
        loading: false,
        error: null
      };
    },
    methods: {
      async getForecast() {
        try {
          const resp = await axios.get(secrets.forecast);
          this.forecast_data = resp.data;
          this.processForecastData();
          
          // Extract the next 3-hour intervals (e.g., next 4 intervals)
          this.forecastData = resp.data.list.slice(0, 4);
        } catch (error) {
          console.log(`Error fetching forecast: ${error}`);
          this.error = 'Failed to load forecast data';
        }
      },
      
      processForecastData() {
        if (!this.forecast_data.list || this.forecast_data.list.length === 0) return;
        
        const dailyForecasts = {};
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        // First pass: group all forecasts by day
        this.forecast_data.list.forEach(forecast => {
          const date = new Date(forecast.dt * 1000);
          const dayKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
          
          if (!dailyForecasts[dayKey]) {
            dailyForecasts[dayKey] = {
              date: date,
              dayName: dayNames[date.getDay()],
              temps: [],
              midDayForecast: null
            };
          }
          
          // Store all temperatures for this day
          dailyForecasts[dayKey].temps.push(forecast.main.temp);
          
          // Store the forecast closest to midday
          const hour = date.getHours();
          if (hour >= 11 && hour <= 14) {
            dailyForecasts[dayKey].midDayForecast = forecast;
          }
        });
        
        // Second pass: calculate min/max temps and extract midday data
        Object.keys(dailyForecasts).forEach(key => {
          const dayData = dailyForecasts[key];
          
          // Calculate min and max temps for the day
          dayData.minTemp = Math.min(...dayData.temps);
          dayData.maxTemp = Math.max(...dayData.temps);
          
          // If we have a midday forecast, use its icon and description
          if (dayData.midDayForecast) {
            dayData.icon = dayData.midDayForecast.weather[0].icon;
            dayData.description = dayData.midDayForecast.weather[0].description;
          } else if (dayData.temps.length > 0) {
            // Fallback: use first available forecast for the day
            const firstForecast = this.forecast_data.list.find(f => 
              new Date(f.dt * 1000).toISOString().split('T')[0] === key
            );
            if (firstForecast) {
              dayData.icon = firstForecast.weather[0].icon;
              dayData.description = firstForecast.weather[0].description;
            }
          }
          
          // Clean up temporary data
          delete dayData.temps;
          delete dayData.midDayForecast;
        });
        
        // Convert to array and sort by date
        this.forecastDays = Object.values(dailyForecasts)
          .sort((a, b) => a.date - b.date)
          .slice(0, 5); // Ensure we only have 5 days
      },
      
      getWeatherIcon(iconCode) {
        // OpenWeather icon URL pattern
        return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      },
      
      formatTime24h(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: false 
        });
      }
    },
    
    mounted() {
      this.getForecast();
      
      // Update forecast every hour
      this.forecastInterval = setInterval(() => {
        this.getForecast();
      }, 3600000); // 1 hour in milliseconds
    },
    
    beforeUnmount() {
      // Clean up interval
      clearInterval(this.forecastInterval);
    }
  };
  </script>
    
  <style scoped>
  .forecasts-outer-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 2vw;
  }
  
  .separator {
    height: 1px;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.3),
      rgba(255, 255, 255, 0)
    );
    margin: 15px 0;
  }
  
  .top-separator {
    margin-bottom: 25px;
  }
  
  .bottom-separator {
    margin-top: 25px;
  }
  
  .middle-separator {
    width: 1px;
    height: auto;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.3),
      rgba(255, 255, 255, 0)
    );
    margin: 0 20px;
  }
  
  .forecasts-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
  
  .forecast-container {
    background-color: transparent;
    flex: 1;
    min-width: 0; /* Prevents flex items from overflowing */
  }
  
  .forecast-title {
    text-align: center;
    margin-top: 0;
    margin-bottom: 15px;
    color: #fff;
    font-size: 1.3rem;
    position: relative;
  }
  
  .forecast-cards {
    display: flex;
    justify-content: space-between;
  }
  
  .day-card {
    flex: 1;
    min-width: 0; /* Prevents flex items from overflowing */
    text-align: center;
    padding: 10px 5px;
    border-radius: 8px;
    color: #fff;
  }
  
  .day-name {
    font-weight: 700;
    margin-bottom: 5px;
    font-size: 1.1rem;
    white-space: nowrap;
  }
  
  .weather-icon {
    width: 50px;
    height: 50px;
    margin: 5px auto;
  }
  
  .temp-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 5px;
  }
  
  .max-temp {
    font-size: 1.2rem;
    font-weight: 700;
    margin: 0;
    color: #fff;
  }
  
  .min-temp {
    font-size: 1.2rem;
    font-weight: 400;
    margin: 0;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .temp-divider {
    margin: 0 2px;
    color: rgba(255, 255, 255, 0.5);
  }
  
  @media (max-width: 768px) {
    .forecasts-wrapper {
      flex-direction: column;
      gap: 0;
    }
    
    .middle-separator {
      width: 100%;
      height: 1px;
      margin: 25px 0;
      background: linear-gradient(
        to right,
        rgba(255, 255, 255, 0),
        rgba(255, 255, 255, 0.3),
        rgba(255, 255, 255, 0)
      );
    }
    
    .forecast-title {
      font-size: 1.1rem;
    }
    
    .day-name {
      font-size: 0.9rem;
    }
    
    .max-temp, .min-temp {
      font-size: 1rem;
    }
    
    .weather-icon {
      width: 40px;
      height: 40px;
    }
  }
  </style>