/**
 * @Class Storage
 *
 */

function Storage() {
    this.storage = {};
}
/**
 * @function
 * @description Read data from the storage
 * @param key
 * @returns {Object}
 */

Storage.prototype.read = function(key) {
    return this.storage[key];
};

/**
 * @function
 * @description Writes data into the storage
 * @param key
 * @param data
 */

Storage.prototype.write = function(key, data) {
    if (typeof sails !== 'undefined') {
        this.storage[key] =  data;
    }else if (typeof window !== 'undefined') {
        this.storage[key] =  data;
    }
    return this.storage.length++;
};

function clear() {
    this.storage = null;
    this.storage = {length: 0};
}

/**
 * @function
 * @description Clears storage
 */
Storage.prototype.clear = function() {
    var fn = this.storage.clear || clear;
    return fn.call(this);
};

/**
 * @function
 * @description Inherits parent class
 * @param {Object} SubClass
 * @returns {*}
 */

Storage.extend = function inheritsLocal(Sub) {
    var Super  = this;
    Sub.prototype = new Super();
    Sub.prototype.constructor = Sub;
    return Sub;
};

(function(Storage) {
    if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        module.exports =  Storage;
    } else if (typeof define === 'function' && typeof define.amd === 'object') {
        define(function() {
            return Storage;
        });
    }
}(Storage));
