<template>
    <div>
        Departures
    </div>
</template>

<script>
import busAPI from "@/services/bus";
import secrets from "../../secrets.json"

export default {
    data() {
        return {
            departures: {}
        }
    },
    methods: {
        async getDeparturesMossen() {
            try {
                this.departures = await busAPI.makeApiCall(`/stop-areas/${secrets.geopos}/departures`);
                console.log(this.departures);
            } catch (error) {
                console.log("Error getting departures: ", error);
            }
        }
    },
    mounted() {
        this.getDeparturesMossen();
    }
}
</script>