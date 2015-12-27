var CONST_CMS_ONLINE_SALE = 'newdesign_online-sale';

function getUrl(key){
    return 'newdesign_' + key;
}

function _execute(req, output, requestPage, cmsKey){
    req.routeResolved = true;
    req.staticPage = output;
    // setting variable required for GA
    req.PageTypePV = 'Campaign|' + requestPage;
    req.reqPage = requestPage;
    req.cmsKey = cmsKey;
}

var routeStaticPage = function(req, res, next) {
    var cmsKey = req.param('key');
    var requestPage = '',
        output;

    //TO-DO:: Temporary fix until dev environment is completely ready

    if (isEmpty(cmsKey)) {
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
                req.error = err;
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
