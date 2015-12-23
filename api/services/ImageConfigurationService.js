var ImageConfig = require('../models/Image-Config'),
    Image = require('../models/Image');

var mysqlAdapter = require('../../lib/mysql-adapter');

var mysqlConnection;
mysqlAdapter.connect(sails.config.host, sails.config.user, sails.config.password, sails.config.database, function(err, connection){
    mysqlConnection = connection;
});

function ImageConfigurationService(){

}
/**
 *
 * @param url
 * @param ici
 * @param icn
 * @param imgList
 */
ImageConfigurationService.prototype.add = function (url, ici, icn, imgList) {
    ImageConfig.create(url, ici, icn).exec(function (err, config) {
        _.each(imgList, function(image){
            Image.create({
                name : image.name,
                size: image.size,
                width : image.width,
                height: image.height,
                owner : config,
                type : image.type
            }).exec();
        });
    });
}

ImageConfigurationService.prototype.update = function () {

}

ImageConfigurationService.prototype.delete = function () {

}

ImageConfigurationService.prototype.get = function () {

}
module.exports = exports = new ImageConfigurationService();