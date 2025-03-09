<template>
  <div class="clock-container">
    <div class="time">{{ timeFormatted }}</div>
    <div class="date">{{ dateFormatted }}</div>
  </div>
</template>
 
<script>
export default {
  name: 'TimeComponent',
  data() {
    return {
      currentTime: new Date(),
    };
  },
  computed: {
    timeFormatted() {
      const hours = String(this.currentTime.getHours()).padStart(2, '0');
      const minutes = String(this.currentTime.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    },
    dateFormatted() {
      // Get day of week
      const days = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
        'Thursday', 'Friday', 'Saturday'
      ];
      const dayOfWeek = days[this.currentTime.getDay()];
      
      // Get date
      const day = String(this.currentTime.getDate()).padStart(2, '0');
       
      // Get month name
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const month = months[this.currentTime.getMonth()];
       
      return `${dayOfWeek}, ${day} ${month}`;
    }
  },
  mounted() {
    // Update time every second
    this.timerID = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  },
  beforeUnmount() {
    // Clear the interval when component is destroyed
    clearInterval(this.timerID);
  }
};
</script>
 
<style scoped>
.clock-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0;
  padding: 2vh 2vh 6vh 5vh;
  margin-top: 3vh;
  
}

.time {
  color: white;
  font-size: 125px;
  margin: 0;
  padding: 0;
  line-height: 0.9;
  font-weight: 700;
  letter-spacing: -2px;
  font-family: 'Arial', sans-serif;
}

.date {
  color: rgba(255, 255, 255, 0.8);
  font-size: 36px;
  margin: 10px 0 0 5px;
  padding: 0;
  line-height: 1;
  font-weight: 600;
  letter-spacing: 1px;
  font-family: 'Arial', sans-serif;
}
</style>