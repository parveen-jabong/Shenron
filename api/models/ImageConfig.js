module.exports = {
    attributes : {
        url : {
            type: 'string',
            required: true
        },
        ici : {
            type : 'string',
            required: true
        },
        icn : {
            type: 'string',
            required: true
        }
    },
    afterDestroy: function(destroyedRecords, cb) {
        // Destroy any child whose teacher has an ID of one of the
        // deleted teacher models
        Child.destroy({owner: _.pluck(destroyedRecords, 'id')}).exec(cb);
    }
};
