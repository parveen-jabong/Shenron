module.exports = {
    attributes : {
        username : {
            type: 'string',
            required: true,
            unique: true
        },
        name : {
            type : 'string'
        },
        email : {
            type: 'string',
            required: true
        },
        password : {
            type: 'string',
            required: true
        },
        encryptPassword: function () {

        }
    }
};
