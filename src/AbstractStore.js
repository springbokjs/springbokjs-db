export class AbstractStore {
    constructor(db, manager) {
        this.db = db;
        this.manager = manager;
    }

    toVO(result) {
        return this.manager.toVO(result);
    }

    toId(id) {
        return id;
    }

    updateByKey(options) {
        var keyPath = this.manager.VO.keyPath;
        if (!options.fullData[keyPath]) {
            throw new Error('Missing ' + keyPath + ' in fullData');
        }
        options.partialUpdate = options.data !== options.fullData;
        options.criteria = {};
        options.criteria[keyPath] = options.fullData[keyPath];
        options.data = Object.assign({}, options.data);
        delete options.data[keyPath];
        this.update(options);
    }
}
