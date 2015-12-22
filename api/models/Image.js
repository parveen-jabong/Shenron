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
            type: 'integer',
            required: true
        },
        height : {
            type: 'integer',
            required: true
        },
        owner :{
            model : 'Image-Config',
            required: true
        },
        type : {
            type : 'string',
            required: true
        }
    }
};
