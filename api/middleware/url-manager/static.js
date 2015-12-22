
var CONST_CMS_ONLINE_SALE = 'newdesign_online-sale';

function getUrl(key){
    return 'newdesign_' + key;
}

function _execute(req, output, requestPage){
    req.routeResolved = true;
    req.url = '/cms/index';
    req.staticPage = output;
    // setting variable required for GA
    req.PageTypePV = 'Campaign|' + requestPage;
    req.reqPage = requestPage;
}

var routeStaticPage = function(req, resp, next) {
    var request = req.path.split('/');
    var newDesignPrefix = 'newdesign_';
    var requestPage = '';
    var output;

    if (!isEmpty(request[1]) && isEmpty(request[2])) {
        requestPage = request[1];
    }

    //TO-DO:: Temporary fix until dev environment is completely ready

    if (isEmpty(requestPage) || !isEmpty(req.routeResolved) || requestPage === 'images' || requestPage === 'live' || (req.xhr && requestPage !== 'online-sale') || sails.config.pdpregex.test(req.path)) {
        return next();
    } else {
        requestPage = getUrl(requestPage);
        output = sails.SessionStorage.storage[requestPage];
        if(typeof output !== 'undefined'){
            _execute(req, output, requestPage);
            return next();
        }
        MemcacheServices.getStaticPageValue(requestPage, function (err, result) {
            if(err){
                return next();
            }
            if (!isEmpty(result)) {
                result.text = strFormat(result.text);

                if(CONST_CMS_ONLINE_SALE === requestPage){
                    sails.SessionStorage.write(requestPage, result);
                }
                _execute(req, result, requestPage);
                return next();
            } else {
                next();
            }
        });
    }
};

module.exports = routeStaticPage;


