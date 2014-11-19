var databases = new Map();

class Db {
    constructor(dbName, Store, options) {
        this.dbName = dbName;
        options.dbName = dbName;
        this.options = options;
        this.Store = Store;
        this.models = [];
    }

    initialize() {
        return this.Store.initialize(this).then(() => {
            Object.freeze(this);
        });
    }

    add(vo) {
        this.models.push(vo);
    }

    createStore(manager) {
        return new this.Store(this, manager);
    }
}


module.exports = Object.freeze({
    initialize(config, getStore) {
        if (!config) {
            return;
        }
        if (!getStore) {
            getStore = (type) => require('springbokjs-db-' + (type || 'mongo'));
        }
        return Promise.all(Object.keys(config).map((dbKey) => {
            var dbConfig = config[dbKey];
            var Store = getStore(dbConfig.type);
            var db = new Db(dbConfig.dbName, Store, dbConfig);
            databases.set(dbKey, db);
            return db.initialize();
        }));
    },
    get(dbKey) {
        return databases.get(dbKey);
    },
    forEach(callback) {
        return databases.forEach(callback);
    }
});
