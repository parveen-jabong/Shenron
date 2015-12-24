'use strict';

var BaseController = require('./BaseController');

var ImageConfigurationController = BaseController.extend({

    index : function (req, res) {
        var requestBody = req.body;
        req.file('files[]').upload({
                dirname: require('path').resolve(__dirname, '../../.tmp/public/images'),
                saveAs : function (newFileStream, cb) {
                    var fileNameWithExtArray = newFileStream.filename.split('.');
                    cb(null, fileNameWithExtArray[0] + "_" + (requestBody.type || 'desktop') + "." + fileNameWithExtArray[1]);
                }
            },function (err, uploadedFiles) {
            if (err) return res.negotiate(err);
            var metadata = uploadedFiles[0],
                url = req.baseUrl + '/images' + (metadata.fd).substr((metadata.fd).lastIndexOf('/'));
            metadata.imageType = requestBody.type || 'desktop';
            metadata.imageUrl = url;
            if (!requestBody.id) {
                ImageConfigurationService.add(requestBody.url || 'asd', requestBody.ici || 'asd', requestBody.icn || 'asd', metadata, function(err, config, image){
                    if (err) {
                        //sails.log
                    } else {

                    }
                });
            } else {
                ImageConfigurationService.update(id, requestBody.url, requestBody.ici, requestBody.icn, metadata);
            }
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
    },
    create : function(req, res){
        ImageConfigurationService.add('', '', '', null, function(err, config){
            if (err) {

            } else {
                console.log(config.id);
                var data = {
                    configId : config.id
                }
                res.render('upload', data);
            }
        });
    },
    get : function(req, res){
        var imageConfigId = req.params.id;
        ImageConfigurationService.get(imageConfigId, function(err, imageConfig, imageList){
            if (err) {

            } else {
                var files = [];
                _.each(imageList, function(image){
                    files.push({
                        "name": image.name,
                        "size": image.size,
                        "url": image.imageUrl,
                        "thumbnailUrl": image.imageUrl,
                        "deleteUrl": image.imageUrl,
                        "deleteType": "DELETE"
                    })
                });
                return res.json({
                    "files": files
                });
            }
        });
    },
    delete : function(req, res){
        var imageConfigId = req.params.id;
        ImageConfigurationService.get(imageConfigId, function(err, imageConfig, imageList){
            if (err) {

            } else {

            }
        });
    }
});

module.exports = ImageConfigurationController;