module.exports = helper = {
    isEmpty: function isEmpty(obj) {
        if (typeof obj === "undefined") {
            return true;
        } else if (obj === null || typeof obj === "number" || typeof obj === "boolean") {
            return obj ? false : true;
        } else if (typeof obj === "string") {
            return obj.trim().length ? false : true;
        } else if (typeof obj === "object") {
            return Object.keys(obj).length ? false : true;
        } else {
            return false;
        }
    },
    strFormat: function(value){
        if(typeof value !== 'string') return value;
        return value.replace(/(\r\n|\n|\r|\s+)/gm, ' ');
    }
}