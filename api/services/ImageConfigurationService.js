/**
 * Created by Parveen Arora on 24/12/15.
 * This Service is specific to mongo db ImageConfig and Image Model
 */
module.exports = exports = {
    /**
     *
     * @param url
     * @param ici
     * @param icn
     * @param imgList
     */
    add : function (url, ici, icn, attributeId, cmsKey, image, cb) {
        CMSService.get(cmsKey, function(err, cms){
            if(err || !cms){
                sails.log.error('ImageConfigurationService->add Error While getting cms key', err);
            }
            ImageConfig.create({
                url : url,
                ici : ici,
                icn : icn,
                attribute_id : attributeId,
                cms_key : cms
            }).exec(function(err, config){
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
        });
    },

    update : function (imageConfig, url, ici, icn, image, cb) {
        if (imageConfig) {
            imageConfig.url = url;
            imageConfig.ici = ici;
            imageConfig.icn = icn;
            imageConfig.save(function (err, newImageConfig) {
                if (err) {
                    cb(err);
                } else {
                    Image.update({
                        active: true,
                        owner: newImageConfig.id,
                        type: image.imageType.toLowerCase()
                    }, {active : false}).exec(function (err, images) {
                        if (err) {
                            sails.log.error('ImageConfigurationService->update not able to update image');
                        }
                        Image.create({
                            name: image.filename,
                            size: image.size,
                            //@TODO : Width and Height will be added later
                            width: image.width || 0,
                            height: image.height || 0,
                            owner: imageConfig,
                            type: image.imageType.toLowerCase(),
                            imageUrl: image.imageUrl
                        }).exec(function (err, image) {
                            if (err) {
                                cb(err)
                            } else {
                                cb(null, newImageConfig, image);
                            }
                        });
                    });
                }
            });
        }
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
    getByAttributeIdAndCMSKey : function(attributeId, cmsKey, cb){
        CMSService.get(cmsKey, function(err, cms){
            if(err || !cms){
                cb(err, cms);
            } else {
                ImageConfig.findOne({attribute_id : attributeId, cms_key : cms.id}, function(err, imageConfig){
                    if (err || !imageConfig) {
                        cb(err);
                    } else {
                        Image.find().where({ owner: imageConfig.id , active: true}).exec(function(err, images){
                            if (err){
                                cb(err, imageConfig);
                            } else {
                                cb(null, imageConfig, images);
                            }
                        });
                    }
                });
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
    }
};