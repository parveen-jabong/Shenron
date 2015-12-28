'use strict';

var BaseController = require('./BaseController');

var ImageConfigurationController = BaseController.extend({

    index : function (req, res) {
        var requestBody = req.body;
        req.file('files[]').upload({
                dirname: require('path').resolve(__dirname, '../../', sails.config.imageDirPath),
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
            ImageConfigurationService.getByAttributeIdAndCMSKey(requestBody.attributeId, requestBody.cmsKey, function(err, imageConfig, imageList){
                if (err){
                    sails.log.error('ImageConfigurationService->index Error while getting imageconfig by attributeid and cmskey', err);
                } else {
                    if (!imageConfig) {
                        ImageConfigurationService.add(requestBody.url, requestBody.ici, requestBody.icn, requestBody.attributeId, requestBody.cmsKey, metadata, function(err, imagconfig){
                            if (err) {
                                sails.log.error('ImageConfigurationService->index Error while adding imageconfig', err);
                            }
                        });
                    } else {
                        ImageConfigurationService.update(imageConfig, requestBody.url, requestBody.ici, requestBody.icn, metadata, function(err, imageConfig){
                            if (err) {
                                sails.log.error('ImageConfigurationService->index Error while updating imageconfig by attributeid and cmskey', err);
                            }
                        });
                    }
                }
            });

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
    get : function(req, res){
        var attributeId = req.params.id;
        var cmsKey = req.params.key;
        ImageConfigurationService.getByAttributeIdAndCMSKey(attributeId, cmsKey, function(err, imageConfig, imageList){
            if (err) {
                sails.log.error('ImageConfigurationController->get While getting Imageconfiguration by id and cmskey',attributeId, cmsKey, err);
            }
            var files = [];
            var types = [
                "desktop",
                "tab",
                "mweb",
                "app"
            ];
            _.each(imageList, function(image){
                types.splice(types.indexOf(image.type), 1);
                files.push({
                    "name": image.name,
                    "size": image.size,
                    "url": image.imageUrl,
                    "thumbnailUrl": image.imageUrl,
                    "deleteUrl": image.imageUrl,
                    "updatedAt" : image.updatedAt,
                    "deleteType": "DELETE",
                    "type" : image.type
                });
            });
            for(var i=0; i<types.length; i++) {
                files.push({
                    type : types[i]
                })
            }
            console.log('imageConfig',imageConfig   );
            return res.render('upload-new',{
                files: files,
                url : imageConfig.url,
                ici : imageConfig.ici,
                icn : imageConfig.icn
            });
        });
    },
    delete : function(req, res){
        var imageConfigId = req.params.id;
        ImageConfigurationService.delete(imageConfigId, function(err, imageConfig, imageList){
            if (err) {
                res.json({
                    success : false,
                    message : [err.message]
                });
            } else {
                res.json({
                    success : true,
                    message : ['Deleted Successfully']
                });
            }
        });
    }
});

module.exports = ImageConfigurationController;