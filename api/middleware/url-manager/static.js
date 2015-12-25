
var CONST_CMS_ONLINE_SALE = 'newdesign_online-sale';

function getUrl(key){
    return 'newdesign_' + key;
}

function _execute(req, output, requestPage, cmsKey){
    req.routeResolved = true;
    req.url = '/static/page/';
    req.staticPage = output;
    // setting variable required for GA
    req.PageTypePV = 'Campaign|' + requestPage;
    req.reqPage = requestPage;
    req.cmsKey = cmsKey;
}

var routeStaticPage = function(req, resp, next) {
    var request = req.path.split('/');
    var cmsKey = '',
        requestPage = '',
        output;

    if (!isEmpty(request[1]) && isEmpty(request[2])) {
        cmsKey = request[1];
    }

    //TO-DO:: Temporary fix until dev environment is completely ready

    if (isEmpty(cmsKey) || !isEmpty(req.routeResolved) || cmsKey === 'images' || cmsKey === 'live' || (req.xhr && cmsKey !== 'online-sale') || sails.config.pdpregex.test(req.path)) {
        return next();
    } else {
        requestPage = getUrl(cmsKey);
        output = sails.SessionStorage.storage[requestPage];
        if(typeof output !== 'undefined'){
            _execute(req, output, requestPage, cmsKey);
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
                _execute(req, result, requestPage, cmsKey);
                return next();
            } else {
                next();
            }
        });
    }
};

module.exports = routeStaticPage;


