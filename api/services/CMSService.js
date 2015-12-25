/**
 * Created by Parveen Arora on 25/12/15.
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
    update : function(criteria, update, cb){
        CMS.update(criteria, update).exec(function(err, identifier){
            if (err){
                cb(err);
            } else{
                cb(null, identifier);
            }
        })
    }
}