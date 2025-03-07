<style>
.article-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    gap: 0;
}
.paragraph {
    font-size: 20px;
    margin: 0vw 7vw 0vw 7vw;
}
.title {
    margin: 0;
    font-size: 40px;
}
</style>

<template>
    <div class="news-container" v-if="news_articles != []">
        <div v-for="news in limitArticles" class="article-container">
                <h1 class="title"> {{ news.title }} </h1>
                <p class="paragraph"> {{ news.paragraph }} </p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            loading: false,
            news_articles: []
        }
    },
    computed: {
        limitArticles() {
            if (this.news_articles.length >= 5) {
                return this.news_articles.slice(0, 5);
            } else {
                return this.news_articles;
            }
        }
    },
    methods: {
        async fetchData() {
            try {
                const resp = await axios.get('http://localhost:5000/get-data');
                this.news_articles = resp.data
            } catch (error) {
                console.error('Error fetching data from scraper:', error);
            }
        },
    },
    mounted() {
        this.fetchData(),
        this.timerId = setInterval(() => {
            this.fetchData();
        }, 60000)
    }
}
</script>