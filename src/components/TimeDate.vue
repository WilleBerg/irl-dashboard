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
        const seconds = String(this.currentTime.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
      },
      dateFormatted() {
        const day = String(this.currentTime.getDate()).padStart(2, '0');
        
        // Get month name
        const months = [
          'January', 'February', 'March', 'April', 'May', 'June', 
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const month = months[this.currentTime.getMonth()];
        
        const year = this.currentTime.getFullYear();
        
        return `${day}/${month}/${year}`;
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
    .time {
    color: white;
    font-size: 125px;
    margin: 0 0 0 4vh;
    padding: 0;
    line-height: 1;
    }

    .date {
    color: white;
    font-size: 50px;
    margin: 0;
    padding: 0;
    line-height: 1;
    }

    .clock-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0;
    }
</style>