/**
 * Created by Parveen Arora on 26/12/15.
 * This Service is specific to Bob database.
 * It is used to create a SQL connection and push html in the tables.
 */

module.exports = {
    updateCMSDatabase : function(key, content, cb){
        //mySQLConnection is created in bootstrap.
        key = 'newdesign_' + key;
        sails.mySQLConnection.beginTransaction(function(err) {
            sails.mySQLConnection.query("SELECT * FROM `cms_folder` WHERE (cms_folder.key = ?) AND (is_active = 1)", key, function (err, result) {
                if (err) {
                    return sails.mySQLConnection.rollback(function() {
                        cb(err);
                    });
                }
                var newRevision = result[0].revision + 1;
                sails.mySQLConnection.query("UPDATE `cms_folder` SET `is_active` = '0' WHERE (cms_folder.key = ?) AND (is_active = 1)", key, function(err, result){
                    if (err) {
                        return sails.mySQLConnection.rollback(function() {
                            cb(err);
                        });
                    }
                    var cms_folder = {
                        fk_cms_folder_type : '2',
                        fk_acl_user: '3383',
                         key:key,
                        is_active : '1',
                        revision : newRevision,
                        created_at: new Date()
                    };
                    sails.mySQLConnection.query("INSERT INTO `cms_folder` SET ?", cms_folder, function(err, result){
                        if (err) {
                            return sails.mySQLConnection.rollback(function() {
                                cb(err);
                            });
                        }
                        var cms_item = {
                            fk_cms_folder : result.insertId,
                            fk_acl_user: '3383',
                            fk_cms_item_type: '2',
                            content:content
                        };
                        sails.mySQLConnection.query("INSERT INTO `cms_item` SET ?", cms_item, function(err, result){
                            if (err) {
                                return sails.mySQLConnection.rollback(function() {
                                    cb(err);
                                });
                            }
                            sails.mySQLConnection.commit(function(err) {
                                if (err) {
                                    return sails.mySQLConnection.rollback(function() {
                                        cb(err);
                                    });
                                }
                                cb(null, true);
                            });
                        });
                    });
                });
            });
        });
    }
};