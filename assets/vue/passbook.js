const passbook = new Vue({
    el: '#app-passbook',
    data: {
        banks: []
    },
    created () {
        fetch('/api/auth/passbook')
          .then(res => res.json())
          .then(json => {
            this.banks = json
        });
      }
});