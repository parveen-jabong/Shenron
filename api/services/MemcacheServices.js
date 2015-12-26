//@TODO: Can be optimized

var PHPUnserialize = require('php-unserialize');
var Memcached = require('memcached-encoding-fork');
var memcachedInstance;

function hasWhiteSpace(value) {
    return /[\s\n\r]/.test(value);
}

var setupAndReturn = function() {
    if (!memcachedInstance) {
        try {
            var host = sails.config.memcache.host + ':' + sails.config.memcache.port;
            memcachedInstance = new Memcached(host, {
                encoding: 'binary',
                zlibInflate: true,
                poolSize: sails.config.memcachePoolSize || 10
            });
        } catch (err) {
            sails.log.error("MEMCACHED ERROR: Failed while getting client : " + (err.stack || JSON.stringify(err)));
        }
    }
    return memcachedInstance;
};

var MemcacheServices = {

    getInstance: function() {
        return setupAndReturn();
    },

    getValueByKey: function(key, callback) {
        var client = MemcacheServices.getInstance();
        if (!sails.config.memcache.enabled) {
            return callback();
        }
        if (hasWhiteSpace(key)) {
            return callback(null, {});
        }
        client.get(key, function(err, response) {
            if (err && err.type !== "NOT_FOUND") {
                sails.log.error("MEMCACHED ERROR: Failed while getting value by key ( " + key + " ) : " + (err.stack || JSON.stringify(err)));
                callback(err);
                return;
            }
            if (!_.isEmpty(response)) {
                try {
                    response = PHPUnserialize.unserialize((new Buffer(response, 'binary')).toString());
                } catch (e) {
                    if (e.name === 'SyntaxError') {
                        response = PHPUnserialize.unserialize(response);
                    } else {
                        callback(e);
                    }
                }

                callback(null, response);
            } else {

                callback(new Error('Key does not exist : ' + key));
            }
        });
    },
    setValueByKey: function(key, value, callback) {
        var client = MemcacheServices.getInstance();
        if (!sails.config.memcache.enabled) {
            return callback();
        }
        // setting with infinite time by default
        client.set(key, value, 0, function(err, response) {
            if (err) {
                sails.log.error("MEMCACHED ERROR: Failed while setting value by key ( " + key + " ) : " + (err.stack || JSON.stringify(err)));
                callback(err);
                return;
            }

            callback(null, response);
        });
    },

    getModuleConfig: function(moduleName, configName, defaultValue, callback) {
        var client = MemcacheServices.getInstance();
        if (!sails.config.memcache.enabled) {
            if (typeof callback === 'function') {
                callback(new Error('Memcache is not enabled'));
            }
            return false;
        }
        var key = sails.config.memcacheKeyPrefix + moduleName + '_configuration';
        if (hasWhiteSpace(key)) {
            return callback(null, {});
        }
        client.get(key, function(err, result) {
            if (err && err.type !== "NOT_FOUND") {
                sails.log.error("MEMCACHED ERROR: (getModuleConfig) Failed while getting value by key ( " + key + " ) : " + (err.stack || JSON.stringify(err)));
                callback(err);
                return;
            }

            if (!_.isEmpty(result)) {
                try {
                    result = PHPUnserialize.unserialize(new Buffer(result, 'binary').toString());
                } catch (e) {
                    if (e.name === 'SyntaxError') {
                        //retry with no buffer
                        result = PHPUnserialize.unserialize(result);
                    } else {
                        callback(e);
                    }
                }
                if (_.has(result, configName)) {
                    callback(null, result[configName]);
                } else {
                    callback(null, defaultValue);
                }
            } else {
                callback(null, 'No Configuration Exist');
            }
        });
    },
    getNewDesignModuleConfig: function(moduleName, callback) {
        var client = MemcacheServices.getInstance();
        if (!sails.config.memcache.enabled) {
            return false;
        }
        var key = sails.config.memcacheKeyPrefix + moduleName + '_configuration';
        if (hasWhiteSpace(key)) {
            return callback(null, {});
        }
        client.get(key, function(err, result) {
            if (err && err.type !== "NOT_FOUND") {
                sails.log.error("MEMCACHED ERROR: (getNewDesignModuleConfig) Failed while getting value by key ( " + key + " ) : " + (err.stack || JSON.stringify(err)));
                callback(err);

                return;
            }

            if (!_.isEmpty(result)) {
                try {
                    result = PHPUnserialize.unserialize(new Buffer(result, 'binary').toString());
                } catch (e) {
                    if (e.name === 'SyntaxError') {
                        result = PHPUnserialize.unserialize(result);
                    } else {
                        callback(e);
                    }
                }
                callback(null, result);

            } else {

                callback(null, 'No Configuration Exist');
            }
        });
    },


    /* @param {Object} keys collection by name
     * @param {function} A callback to be executed post receiving memcache data
     * @returns {*}
     */

    getMultipleBlocksByName: function(keys, callback) {
        var client = MemcacheServices.getInstance(),
            completeKeys = [],
            finalSet = [],
            output = {};

        _.each(keys, function(key) {
            if (!hasWhiteSpace(key.name) && !hasWhiteSpace(key.type)) { // skip key from being added if it has whitespaces
                completeKeys.push(key);
            }
        });

        if (!sails.config.memcache.enabled) {
            if (typeof callback === 'function') {
                callback(new Error('Memcache is not enabled'));
            }
            return false;
        }
        completeKeys.forEach(function(item) {
            finalSet.push(item.name);
        });
        if (finalSet.length) {
            client.get(finalSet, function(err, data) {
                if (err && err.type !== "NOT_FOUND") {
                    sails.log.error("MEMCACHED ERROR: Failed while getting value by key ( " + finalSet + " ) : " + (err.stack || JSON.stringify(err)));
                    client.disconnect();
                    callback(err);
                } else {
                    _.each(data, function(value, key) {
                        try {
                            output[key] = PHPUnserialize.unserialize(new Buffer(value, 'binary').toString());
                        } catch (e) {
                            if (e.name === 'SyntaxError') {
                                output[key] = PHPUnserialize.unserialize(value);
                                //retry
                            } else {
                                throw e
                            }
                        }
                    });
                    callback(null, output);
                }
            });
        } else {
            callback(null, output);
        }
    },

    /**
     *
     * @param {Object} Static blocks keys collection
     * @param {function} A callback to be executed post receiving memcache data
     * @returns {*}
     */

    getMultipleBlocksByKeys: function(keys, callback) {
        var client = MemcacheServices.getInstance(),
            completeKeys = [],
            finalSet = [],
            _this = this,
            output = {},
            isTrimDisabled = arguments[2];
        _.each(keys, function(key) {
            if (!hasWhiteSpace(key.name) && !hasWhiteSpace(key.type)) { // skip key from being added if it has whitespaces
                completeKeys.push(_this.getKeys(key.name, '_' + key.type));
            }
        });
        if (!sails.config.memcache.enabled) {
            if (typeof callback === 'function') {
                callback(new Error('Memcache is not enabled'));
            }
            return false;
        }
        sails.log.silly("STATIC Blocks: Fetching from multiple block keys " + completeKeys);

        completeKeys.forEach(function(item) {
            var result = sails.SessionStorage.storage[item];
            if (typeof result === 'undefined') {
                finalSet.push(item);
            } else {
                sails.log.silly("NODE CACHE:: Fetched data from cache.");
                output[item] = result;
            }
        });

        if (finalSet.length) {
            sails.log.verbose("MEMCACHED: Fetching from multiple block keys " + finalSet);
            client.get(finalSet, function(err, data) {
                // var output = {};
                if (err && err.type !== "NOT_FOUND") {
                    LOGGER.log.error("MEMCACHED ERROR: Failed while getting value by key ( " + finalSet + " ) : " + (err.stack || JSON.stringify(err)));
                    callback(err);
                } else {
                    _.each(data, function(value, key) {
                        try {
                            output[key] = PHPUnserialize.unserialize(new Buffer(value, 'binary').toString());
                        } catch (e) {
                            if (e.name === 'SyntaxError') {
                                output[key] = PHPUnserialize.unserialize(value);
                                //retry
                            } else {
                                throw e
                            }
                        }
                        if (!isTrimDisabled) {
                            output[key].items.text = strFormat(output[key].items.text);
                        }
                        sails.SessionStorage.write(key, output[key]);
                    });
                    sails.log.error('No Block Exist');
                    callback(null, output);
                }
            });
        } else {
            callback(null, output);
        }
    },
    /**
     *
     * @param key
     * @param type
     * @param callback
     * @returns {*}
     */

    getFolderByKey: function(key, type, callback) {
        if (!sails.config.memcache.enabled) {
            return callback();
        }

        MemcacheServices
            .getValueByKey(MemcacheServices.getKeys(key, '_' + type), function(err, result) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, result);
                }
            });
    },
    getStaticPageValue: function(key, callback) {
        if (!sails.config.memcache.enabled) {
            return callback();
        }
        MemcacheServices.getValueByKey(MemcacheServices.getKeys(key, '_staticpage'), function(err, response) {
            if (err) {
                callback(err);
                sails.log.error(key, 'Staticpage does not exist');
            } else {
                if (!isEmpty(response.items) && !isEmpty(response.items.text)) {
                    callback(null, response.items);
                } else {
                    callback('Wrong static Block');
                }
            }
        });
    },
    getKeys: function(key, type) {
        return sails.config.memcacheKeyPrefix + 'cms_' + key + type;
    }

};

module.exports = MemcacheServices;