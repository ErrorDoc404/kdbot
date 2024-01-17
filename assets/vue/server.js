var app = new Vue({
    el: '#server',
    data() {
        return {
            user: [],
            guilds: [],
            session: [],
            modules: [],
            name: 'Alash'
        }
    },
    created() {
        const currentURL = window.location.href;
        const urlParts = currentURL.split('/');
        const lastPart = urlParts[urlParts.length - 1];
        fetch('/api/server/' + lastPart)
            .then(response => response.json())
            .then(data => (this.modules = data))
    },
    methods: {
        createChannel: function () {
            alert('clicked');
        }
    }
});