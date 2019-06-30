export default class HashMap {

    constructor({entries = []}) {
        this._map = new Map();
        entries.forEach(e => this.set(e[0], e[1]));
    }
    
    get(key) {
        return this._map.get(JSON.stringify(key));
    }

    set(key, value) {
        this._map.set(JSON.stringify(key), value);
    }

    hasKey(key) {
        return this._map.has(JSON.stringify(key));
    }

    getKeys() {
        return Array.from(this._map.keys()).map(key => JSON.parse(key));
    }

    size() {
        return this._map.size;
    }

    static copy(hashMap) {
        return new HashMap({entries: Array.from(hashMap._map.entries())
                .map(entry => [JSON.parse(entry[0]), entry[1]])});
    }
}
