module.exports = {
    attributes : {
        name : {
            type: 'string',
            required: true
        },
        size : {
            type : 'string',
            required: true
        },
        width : {
            type: 'integer'
        },
        height : {
            type: 'integer'
        },
        active : {
            type: 'boolean',
            defaultsTo: true
        },
        path : {
            type : 'string'
        },
        imageUrl : {
            type : 'string'
        },
        owner :{
            model : 'ImageConfig',
            required: true
        },
        type : {
            type : 'string',
            enum: ['desktop', 'mweb', 'tab', 'app'],
            required: true
        }
    }
};
