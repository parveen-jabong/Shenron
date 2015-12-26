var mysqlAdapter = require('../../lib/mysql-adapter');

var mysqlConnection;
mysqlAdapter.connect(sails.config.host, sails.config.user, sails.config.password, sails.config.database, function(err, connection){
    mysqlConnection = connection;
});

module.exports = exports = {
    /**
     *
     * @param url
     * @param ici
     * @param icn
     * @param imgList
     */
    add : function (url, ici, icn, image, cb) {
        console.log('In Add');
        ImageConfig.create({
            url : url,
            ici : ici,
            icn : icn
        }).exec(function(err, config){
            console.log('hello', image);
            if (err){
                cb(err);
            } else {
                if (image){
                    Image.create({
                        name : image.filename,
                        size: image.size,
                        //@TODO : Width and Height will be added later
                        width : image.width || 0,
                        height: image.height || 0,
                        owner : config,
                        type : image.imageType.toLowerCase(),
                        imageUrl : image.imageUrl
                    }).exec(function(err, image){
                        if (err) {
                            cb(err)
                        } else {
                            cb(null, config, image);
                        }
                    });
                } else {
                    cb(null, config)
                }
            }
        });
    },

    update : function (id, url, ici, icn, image, cb) {
        ImageConfig.findOne({id: id}).exec(function(err, imageConfig){
            if (err){
                return cb(err);
            } else {
                imageConfig.url = url;
                imageConfig.ici = ici;
                imageConfig.icn = icn;
                imageConfig.save(function(err, newImageConfig){
                    if (err){
                        cb(err)
                    } else {
                        Image.update({active:true, owner:imageConfig, type:image.imageType.toLowerCase()}, {active:false});
                        Image.create({
                            name : image.filename,
                            size: image.size,
                            //@TODO : Width and Height will be added later
                            width : image.width || 0,
                            height: image.height || 0,
                            owner : imageConfig,
                            type : image.imageType.toLowerCase(),
                            imageUrl : image.imageUrl
                        }).exec(function(err, image){
                            if (err) {
                                cb(err)
                            } else {
                                cb(null, image);
                            }
                        });
                    }
                });
            }
        });
    },

    delete : function (id, cb) {
        ImageConfig.destroy({id: id}).exec(function (err, imageConfig){
            if (err){
                cb(err);
            } else {
                cb(null, imageConfig);
            }
        });
    },

    get : function (id, cb) {
        ImageConfig.findOne({id : id}, function(err, imageConfig){
            if (err || !imageConfig) {
                cb(err)
            } else {
                console.log(err, imageConfig);
                Image.find().where({ owner: imageConfig.id }).exec(function(err, images){
                    if (err){
                        cb(err, imageConfig);
                    } else {
                        cb(null, imageConfig, images);
                    }
                });
            }
        });
    },
    updateCMSDatabase : function(){
        if(mysqlConnection) {
            mysqlConnection.beginTransaction(function(err) {
                if (err) {
                    throw err;
                } else {
                    mysqlConnection.query("SELECT `cms_folder`.`revision` FROM `cms_folder` WHERE (cms_folder.key = '?') AND (is_active = 1)", key, function(err, result) {
                        if (err) {
                            return mysqlConnection.rollback(function() {
                                throw err;
                            });
                        }
                        mysqlConnection.commit(function(err) {
                            if (err) {
                                return mysqlConnection.rollback(function() {
                                    throw err;
                                });
                            }
                        });
                    });
                }
            });
        }
    }
};