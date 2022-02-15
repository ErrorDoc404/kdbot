const index = new Vue({
  el: '#app-server',
  data: {
    user: {
      _id: null,
      discordId: null,
      discordTag: null,
      avatar: null,
      guilds: null
    },
    guilds: [],
    cache: []
  },
  created () {
    fetch('/api/auth')
      .then(res => res.json())
      .then(json => {
        this.user = json
      });

    fetch('/api/user')
      .then(res => res.json())
      .then(json => {
        this.guilds = json.user.guilds
    });

    fetch('/api/user/guild/cache')
      .then(res => res.json())
      .then(json => {
        this.cache = json
    });
  }
})
