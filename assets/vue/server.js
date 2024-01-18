var app = new Vue({
    el: '#server',
    data() {
        return {
            user: [],
            guildConfig: null,
            session: [],
            modules: [],
            admins: [],
            server: null,
            name: 'Akash'
        }
    },
    created() {
        const currentURL = window.location.href;
        const urlParts = currentURL.split('/');
        const lastPart = urlParts[urlParts.length - 1];
        this.server = lastPart;
        fetch('/api/server/' + lastPart)
            .then(response => response.json())
            .then(data => (this.modules = data))

        fetch('/api/server/admins/' + lastPart)
            .then(response => response.json())
            .then(data => this.admins = data)

        fetch('/api/server/guilds/' + lastPart)
            .then(response => response.json())
            .then(data => (this.guildConfig = data))
    },
    methods: {
        createChannel: function () {
            alert('clicked');
        }
    }
});