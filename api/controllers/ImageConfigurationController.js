'use strict';

var BaseController = require('./BaseController');

var ImageConfigurationController = BaseController.extend({

    index : function (req, res) {
        req.file('files[]').upload({dirname: require('path').resolve(__dirname, '../../.tmp/public/images')},function (err, uploadedFiles) {
            if (err) return res.negotiate(err);
            var metadata = uploadedFiles[0];
            var url = req.baseUrl + '/images' + (metadata.fd).substr((metadata.fd).lastIndexOf('/'));
            return res.json({
                "files": [
                    {
                        "name": metadata.filename,
                        "size": metadata.size,
                        "url": url,
                        "thumbnailUrl": url,
                        "deleteUrl": url,
                        "deleteType": "DELETE"
                    }]
            })
        });
    }
});

module.exports = ImageConfigurationController;