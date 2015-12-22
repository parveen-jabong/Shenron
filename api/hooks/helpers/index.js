var methods = require('./private/helpers');

module.exports= function helpers(sails){
    for(var key in methods){
        global[key] = methods[key];
    }
    return methods;
}
