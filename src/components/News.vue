<template>
  <div class="news-container">
    <transition name="fade" mode="out-in">
      <div v-if="currentArticle" :key="currentIndex" class="article-container">
        <h1 class="title">{{ currentArticle.title }}</h1>
        <p class="paragraph">{{ currentArticle.paragraph }}</p>
      </div>
    </transition>
    <div class="pagination">
      <span v-for="(_, index) in news_articles" 
            :key="index" 
            :class="['dot', index === currentIndex ? 'active' : '']"
            @click="showArticle(index)"></span>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      loading: false,
      news_articles: [],
      currentIndex: 0,
      transitionInterval: null
    }
  },
  computed: {
    currentArticle() {
      if (this.news_articles.length > 0) {
        return this.news_articles[this.currentIndex];
      }
      return null;
    }
  },
  methods: {
    async fetchData() {
      try {
        console.log("getting data");
        const resp = await axios.get('http://localhost:5001/get-data');
        this.news_articles = resp.data;
        
        // Reset index if no current article is available
        if (this.currentIndex >= this.news_articles.length) {
          this.currentIndex = 0;
        }
      } catch (error) {
        console.error('Error fetching data from scraper:', error);
      }
    },
    showArticle(index) {
      this.currentIndex = index;
    },
    startTransition() {
      // Clear any existing interval
      if (this.transitionInterval) {
        clearInterval(this.transitionInterval);
      }
      
      // Create new interval to transition articles
      this.transitionInterval = setInterval(() => {
        if (this.news_articles.length > 0) {
          this.currentIndex = (this.currentIndex + 1) % this.news_articles.length;
        }
      }, 10000); // Transition every 7 seconds
    }
  },
  mounted() {
    this.fetchData();
    
    // Set up interval to fetch new data every minute
    this.dataInterval = setInterval(() => {
      this.fetchData();
    }, 60000);
    
    // Start article transitions
    this.startTransition();
  },
  beforeUnmount() {
    // Clean up intervals when component is destroyed
    clearInterval(this.dataInterval);
    clearInterval(this.transitionInterval);
  }
}
</script>

<style>
.article-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 300px; /* Fixed height for consistent transitions */
  box-sizing: border-box;
  gap: 0;
  margin-top: 0vh;
  margin-bottom: 0vh;
}

.paragraph {
  font-size: 26px;
  margin: 0vw 7vw 0vw 7vw;
  align-self: flex-start;
}

.title {
  margin: 0vw 7vw 0vw 7vw;
  font-size: 40px;
  line-height: 1.1;
}

/* Transition effects */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Pagination dots */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.dot {
  height: 10px;
  width: 10px;
  margin: 0 5px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dot.active {
  background-color: #555;
}
</style>