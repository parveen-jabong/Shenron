module.exports = function(req, res, next) {
    res.locals.flash = function() {
        var result = req.flash();
        // if we have no flash messages, just exit cleanly.
        if (!Object.keys(result).length) {
            return false;
        } else {
            return joinAndSingletMessages(result);
        }
    };
    next();
};

// It combine messages based on group error/success and filter out duplicate entries
function joinAndSingletMessages(result) {
    if (result.error) {
        result.error = _.uniq(result.error);
        result.error = [result.error.join(' ')];
    } else if (result.success) {
        result.success = _.uniq(result.success);
        result.success = [result.success.join(' ')];
    }

    return result;
}
