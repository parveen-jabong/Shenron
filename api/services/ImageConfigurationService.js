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
    add : function (url, ici, icn, image, cb) {
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
    }
};