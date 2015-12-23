'use strict';
var path = require('path'),
    fs = require('fs'),
// Since Node 0.8, .existsSync() moved from path to fs:
    _existsSync = fs.existsSync || path.existsSync,
    formidable = require('formidable'),
    nodeStatic = require('node-static'),
    imageMagick = require('imagemagick'),
    options = {
        tmpDir: __dirname + '/tmp',
        publicDir: __dirname + '/public',
        uploadDir: __dirname + '/public/files',
        uploadUrl: '/files/',
        maxPostSize: 11000000000, // 11 GB
        minFileSize: 1,
        maxFileSize: 10000000000, // 10 GB
        acceptFileTypes: /.+/i,
        // Files not matched by this regular expression force a download dialog,
        // to prevent executing any scripts in the context of the service domain:
        inlineFileTypes: /\.(gif|jpe?g|png)$/i,
        imageTypes: /\.(gif|jpe?g|png)$/i,
        imageVersions: {
            'thumbnail': {
                width: 80,
                height: 80
            }
        },
        accessControl: {
            allowOrigin: '*',
            allowMethods: 'OPTIONS, HEAD, GET, POST, PUT, DELETE',
            allowHeaders: 'Content-Type, Content-Range, Content-Disposition'
        },
        /* Uncomment and edit this section to provide the service via HTTPS:
         ssl: {
         key: fs.readFileSync('/Applications/XAMPP/etc/ssl.key/server.key'),
         cert: fs.readFileSync('/Applications/XAMPP/etc/ssl.crt/server.crt')
         },
         */
        nodeStatic: {
            cache: 3600 // seconds to cache served files
        }
    },
    utf8encode = function (str) {
        return unescape(encodeURIComponent(str));
    },
    fileServer = new nodeStatic.Server(options.publicDir, options.nodeStatic),
    nameCountRegexp = /(?:(?: \(([\d]+)\))?(\.[^.]+))?$/,
    nameCountFunc = function (s, index, ext) {
        return ' (' + ((parseInt(index, 10) || 0) + 1) + ')' + (ext || '');
    },
    FileInfo = function (file) {
        this.name = file.name;
        this.size = file.size;
        this.type = file.type;
        this.deleteType = 'DELETE';
    },
    UploadHandler = function (req, res, callback) {
        this.req = req;
        this.res = res;
        this.callback = callback;
    },
    serve = function (req, res, callback) {
        console.log("current dir",__dirname, options);
        res.setHeader(
            'Access-Control-Allow-Origin',
            options.accessControl.allowOrigin
        );
        res.setHeader(
            'Access-Control-Allow-Methods',
            options.accessControl.allowMethods
        );
        res.setHeader(
            'Access-Control-Allow-Headers',
            options.accessControl.allowHeaders
        );
        var setNoCacheHeaders = function () {
                res.setHeader('Pragma', 'no-cache');
                res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
                res.setHeader('Content-Disposition', 'inline; filename="files.json"');
            },
            handler = new UploadHandler(req, res, callback);
        console.log("methi",req.method);
        switch (req.method) {
            case 'OPTIONS':
                res.end();
                break;
            case 'HEAD':
            case 'GET':
                if (req.url === '/') {
                    setNoCacheHeaders();
                    if (req.method === 'GET') {
                        handler.get();
                    } else {
                        res.end();
                    }
                } else {
                    fileServer.serve(req, res);
                }
                break;
            case 'POST':
                setNoCacheHeaders();
                handler.post();
                break;
            case 'DELETE':
                handler.destroy();
                break;
            default:
                res.statusCode = 405;
                res.end();
        }
    };
fileServer.respond = function (pathname, status, _headers, files, stat, req, res, finish) {
    console.log("respond");
    // Prevent browsers from MIME-sniffing the content-type:
    _headers['X-Content-Type-Options'] = 'nosniff';
    if (!options.inlineFileTypes.test(files[0])) {
        // Force a download dialog for unsafe file extensions:
        _headers['Content-Type'] = 'application/octet-stream';
        _headers['Content-Disposition'] = 'attachment; filename="' +
            utf8encode(path.basename(files[0])) + '"';
    }
    nodeStatic.Server.prototype.respond
        .call(this, pathname, status, _headers, files, stat, req, res, finish);
};
FileInfo.prototype.validate = function () {
    console.log("inside validate");
    if (options.minFileSize && options.minFileSize > this.size) {
        this.error = 'File is too small';
    } else if (options.maxFileSize && options.maxFileSize < this.size) {
        this.error = 'File is too big';
    } else if (!options.acceptFileTypes.test(this.name)) {
        this.error = 'Filetype not allowed';
    }
    return !this.error;
};
FileInfo.prototype.safeName = function () {
    console.log("safe name");
    // Prevent directory traversal and creating hidden system files:
    this.name = path.basename(this.name).replace(/^\.+/, '');
    // Prevent overwriting existing files:
    while (_existsSync(options.uploadDir + '/' + this.name)) {
        this.name = this.name.replace(nameCountRegexp, nameCountFunc);
    }
};
FileInfo.prototype.initUrls = function (req) {
    console.log("init urls");
    if (!this.error) {
        var that = this,
            baseUrl = (options.ssl ? 'https:' : 'http:') +
                '//' + req.headers.host + options.uploadUrl;
        this.url = this.deleteUrl = baseUrl + encodeURIComponent(this.name);
        Object.keys(options.imageVersions).forEach(function (version) {
            if (_existsSync(
                    options.uploadDir + '/' + version + '/' + that.name
                )) {
                that[version + 'Url'] = baseUrl + version + '/' +
                    encodeURIComponent(that.name);
            }
        });
    }
};
UploadHandler.prototype.get = function () {
    var handler = this,
        files = [];
    fs.readdir(options.uploadDir, function (err, list) {
        console.log("list--------",list);
        list.forEach(function (name) {
            var stats = fs.statSync(options.uploadDir + '/' + name),
                fileInfo;
            if (stats.isFile() && name[0] !== '.') {
                fileInfo = new FileInfo({
                    name: name,
                    size: stats.size
                });
                fileInfo.initUrls(handler.req);
                files.push(fileInfo);
            }
        });
        handler.callback({files: files});
    });
};
UploadHandler.prototype.post = function () {
    console.log("in post");
    var handler = this,
        form = new formidable.IncomingForm(),
        tmpFiles = [],
        files = [],
        map = {},
        counter = 1,
        redirect,
        finish = function () {
            console.log("finish ");
            counter -= 1;
            if (!counter) {
                files.forEach(function (fileInfo) {
                    fileInfo.initUrls(handler.req);
                });
                handler.callback({files: files}, redirect);
            }
        };
    console.log("form",form);
    form.uploadDir = options.tmpDir;
    form.on('fileBegin', function (name, file) {
        console.log("file begin");
        tmpFiles.push(file.path);
        var fileInfo = new FileInfo(file, handler.req, true);
        fileInfo.safeName();
        map[path.basename(file.path)] = fileInfo;
        files.push(fileInfo);
    }).on('field', function (name, value) {
        if (name === 'redirect') {
            redirect = value;
        }
    }).on('file', function (name, file) {
        console.log("file",file);
        var fileInfo = map[path.basename(file.path)];
        fileInfo.size = file.size;
        if (!fileInfo.validate()) {
            fs.unlink(file.path);
            return;
        }
        fs.renameSync(file.path, options.uploadDir + '/' + fileInfo.name);
        if (options.imageTypes.test(fileInfo.name)) {
            Object.keys(options.imageVersions).forEach(function (version) {
                counter += 1;
                var opts = options.imageVersions[version];
                imageMagick.resize({
                    width: opts.width,
                    height: opts.height,
                    srcPath: options.uploadDir + '/' + fileInfo.name,
                    dstPath: options.uploadDir + '/' + version + '/' +
                    fileInfo.name
                }, finish);
            });
        }
    }).on('aborted', function () {
        console.log("aborted");
        tmpFiles.forEach(function (file) {
            fs.unlink(file);
        });
    }).on('error', function (e) {
        console.log("errrr");
        console.log(e);
    }).on('progress', function (bytesReceived, bytesExpected) {
        console.log("progress");
        if (bytesReceived > options.maxPostSize) {
            handler.req.connection.destroy();
        }
    }).on('end', finish).parse(handler.req);
};
UploadHandler.prototype.destroy = function () {
    var handler = this,
        fileName;
    if (handler.req.url.slice(0, options.uploadUrl.length) === options.uploadUrl) {
        fileName = path.basename(decodeURIComponent(handler.req.url));
        if (fileName[0] !== '.') {
            fs.unlink(options.uploadDir + '/' + fileName, function (ex) {
                Object.keys(options.imageVersions).forEach(function (version) {
                    fs.unlink(options.uploadDir + '/' + version + '/' + fileName);
                });
                handler.callback({success: !ex});
            });
            return;
        }
    }
    handler.callback({success: false});
};
console.log("current dir",__dirname);
module.exports = {
    serve : serve
}