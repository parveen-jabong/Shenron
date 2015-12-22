function Store(_sessionStorage) {
    this.storage = _sessionStorage || {length: 0};
}

(function(Store) {
    if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        var Storage = require('./lib/storage');
        module.exports =  Storage.extend(Store);
    } else if (typeof define === 'function' && typeof define.amd === 'object') {
        define(['./storage'], function(Storage) {
            return Storage.extend(Store);
        });
    }
}(Store));