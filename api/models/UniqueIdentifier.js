/**
 * Created by Parveen Arora on 25/12/15.
 */

module.exports = {
    attributes : {
        cms_key: {
            model: 'CMS'
        },
        edit_count : {
            type : 'integer',
            defaultsTo : 0
        },
        locked : {
            type : 'boolean',
            defaultsTo: false
        },
        last_changed_by : {
            model : 'User',
        },
        getEditCount : function(){
            return this.edit_count;
        },
        updateCount : function(count){
            this.edit_count = count;
        }
    }
};