var ImageConfig = require('../models/Image-Config'),
    Image = require('../models/Image');

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
    ImageConfig.create(url, ici, icn);
    _.each(imgList, function(image){
        Image.create(image.name, image.size, image.width, image.height, image,type);
    });
}

ImageConfigurationService.prototype.update = function () {

}

ImageConfigurationService.prototype.delete = function () {

}

ImageConfigurationService.prototype.get = function () {

}
module.exports = exports = new ImageConfigurationService();