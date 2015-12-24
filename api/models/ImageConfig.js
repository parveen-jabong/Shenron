module.exports = {
    attributes : {
        url : {
            type: 'string',
            defaultsTo: ''
        },
        ici : {
            type : 'string',
            defaultsTo: ''
        },
        icn : {
            type: 'string',
            defaultsTo: ''
        }
    },
    afterDestroy: function(destroyedRecords, cb) {
        // Destroy any child whose teacher has an ID of one of the
        // deleted teacher models
        Child.destroy({owner: _.pluck(destroyedRecords, 'id')}).exec(cb);
    }
};
