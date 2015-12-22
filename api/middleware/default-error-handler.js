var errors = function(err, req, res, next) {
    sails.log.error("Default Error Handler executed, this is very bad!", req, err);
    if(req.xhr){
        res.send("");
    }else{
        res.render("500");
    }
};

module.exports = errors;
