module.exports = {
    storeName: 'favorites',
    get() {

        var favs = localStorage.getItem(this.storeName) || {};

        if(typeof favs === 'string')
            favs = JSON.parse(favs);

        return favs;
    },
    list() {
        var obj = this.get();
        var list = [];
        for(var i in obj)
            list.push(obj[i]);

        return list;
    },
    keyExists(key) {
        return this.get()[key];
    },
    add(fav) {

        var stored = localStorage.getItem(this.storeName) || {};

        if(typeof stored === 'string')
            stored = JSON.parse(stored);

        stored[fav.key] = fav;

        localStorage.setItem(this.storeName, JSON.stringify(stored));

        return this;
    },
    remove(key){

        var stored = localStorage.getItem(this.storeName) || {};

        if(typeof stored === 'string')
            stored = JSON.parse(stored);

        delete stored[key];
        
        localStorage.setItem(this.storeName, JSON.stringify(stored));
    }
}