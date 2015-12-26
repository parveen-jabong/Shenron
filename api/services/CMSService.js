/**
 * Created by Parveen Arora on 25/12/15.
 * This Service is specific to mongo db CMS Model
 */

module.exports = {
    get : function(key, cb){
        CMS.findOne({cms_key : key}).exec(function(err, identifier){
            cb(err, identifier);
        })
    },
    add : function(key, content, cb){
        CMS.create({
            cms_key : key,
            content : content
        }).exec(function(err, identifier){
            if (err){
                cb(err);
            } else {
                cb(null, identifier);
            }
        })
    },
    update : function(key, content, cb){
        CMS.update({cms_key : key}, {content : content}).exec(function(err, identifier){
            if (err){
                cb(err);
            } else{
                cb(null, identifier);
            }
        })
    }
}