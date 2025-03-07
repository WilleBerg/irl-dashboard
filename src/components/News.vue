<style>
.article-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    gap: 0;
    margin-top: 4vh;
    margin-bottom: 2vh;
}
.paragraph {
    font-size: 20px;
    margin: 0vw 7vw 0vw 7vw;
    align-self: flex-start;
}
.title {
    margin: 0vw 7vw 0vw 7vw;
    font-size: 40px;
    line-height: 1.1
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
                console.log("getting data")
                const resp = await axios.get('http://192.168.2.100:5001/get-data');
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
