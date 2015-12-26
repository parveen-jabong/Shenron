/**
 * Created by Parveen Arora on 25/12/15.
 */

module.exports = {
    attributes : {
        cms_key: {
            type: 'string'
        },
        // Right Now Supporting Only Static Pages
        cms_key_type : {
            type: 'string',
            defaultsTo : 'staticpage'
        },
        // Right Now Supporting Only HTML Content
        //Enum can be created
        content_type : {
            type : 'string',
            defaultsTo: 'html'
        },
        content : {
            type : 'string'
        }
    }
};
