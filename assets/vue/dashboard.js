var app = new Vue({
    el: '#dashboard',
    data() {
        return {
            user: [],
            guilds: [],
            session: [],
            cache: [],
            stats: [],
        }
    },
    created() {
        fetch('/api/dashboard')
            .then(response => response.json())
            .then(data => (this.user = data))

        fetch('/api/user')
            .then(response => response.json())
            .then(data => (this.guilds = data.user.guilds))

        fetch('/api/user/guild/cache')
            .then(res => res.json())
            .then(json => {
                this.cache = json
            });

        // fetch('/api/dashboard/stats')
        //     .then(res => res.json())
        //     .then(json => {
        //         this.stats = json
        //         this.stats.songsPercentage = (this.stats.userSongs / this.stats.totalSongs) * 100
        //         this.stats.commandsPercentage = (this.stats.userCommands / this.stats.totalCommands) * 100;
        //     });
    }
});