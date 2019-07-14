class HashMap {
    constructor({entries = []}) {
        this._map = new Map();
        entries.forEach(e => this.set(e[0], e[1]));
    }

    get map() {
        return this._map;
    }

    get size() {
        return this._map.size;
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

    static copy({map}) {
        // TODO: find a better way to copy
        return new HashMap({
            entries: Array.from(map.entries())
                .map(entry => [JSON.parse(entry[0]), entry[1]])
        });
    }
}

export { HashMap };
