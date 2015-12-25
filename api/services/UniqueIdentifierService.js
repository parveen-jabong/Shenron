/**
 * Created by Parveen Arora on 25/12/15.
 */

module.exports = {
    getByCmsKey: function(key, cb){
        CMS.findOne({cms_key : key}).exec(function(err, cms){
            if(err || !cms){
                cb(err, cms);
            } else {
                UniqueIdentifier.findOne({cms_key: cms.id}).exec(function(err, identifier){
                    cb(err, identifier);
                });
            }
        });
    },
    add : function(key, userid, cb){
        // We are not adding locking mechanism right now. NO TIME.
        UniqueIdentifier.create({
            cms_key : key,
            last_changed_by : userid
        }).exec(function(err, identifier){
            if (err){
                cb(err);
            } else {
                cb(null, identifier);
            }
        })
    },
    update : function(key, count, cb){
        UniqueIdentifier.find({cms_key : key}).exec(function(err, identifier){
            if (err){
                cb(err);
            } else{
                identifier.updateCount(count);
                cb(null, identifier);
            }
        })
    }
}