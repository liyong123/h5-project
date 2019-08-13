"use strict";
//加载所需要的模块
var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var cp = require('child_process');


//响应请求的函数
function processRequest (request, response) {
    //mime类型
    var mime = {
        "css": "text/css",
        "gif": "image/gif",
        "html": "text/html",
        "ico": "image/x-icon",
        "jpeg": "image/jpeg",
        "jpg": "image/jpeg",
        "js": "text/javascript",
        "json": "application/json",
        "pdf": "application/pdf",
        "png": "image/png",
        "svg": "image/svg+xml",
        "swf": "application/x-shockwave-flash",
        "tiff": "image/tiff",
        "txt": "text/plain",
        "wav": "audio/x-wav",
        "wma": "audio/x-ms-wma",
        "wmv": "video/x-ms-wmv",
        "xml": "text/xml"
    };

    //url模块的parse方法 接受一个字符串，返回一个url对象,切出来路径
    var pathName = url.parse(request.url).pathname;
    //对路径解码，防止中文乱码
    pathName = decodeURI(pathName);

    //解决301重定向问题，如果pathname没以/结尾，并且没有扩展名
    if (!pathName.endsWith('/') && path.extname(pathName) === '') {  //extname:获取path路径文件扩展名
        pathName += '/';
        var redirect = "http://" + request.headers.host + pathName;
        response.writeHead(301, {
            location: redirect
        });
        //response.end方法用来回应完成后关闭本次对话，也可以写入HTTP回应的具体内容。
        response.end();
    }

    //获取资源文件的绝对路径
    /*  var filePath = path.resolve(__dirname + pathName);*/
    //__dirname是访问项目静态资源的路径,此处静态页面就放在根目录下，所以直接用__dirname,如果静态页面放在其他目录下，替换__dirname 即可
    var filePath = path.resolve(__dirname + pathName);
    console.log("filePath:", filePath);
    //获取对应文件的文档类型
    //通过path.extname来获取文件的扩展名。由于extname返回值包含”.”，所以通过slice方法来剔除掉”.”，
    //对于没有后缀名的文件，一律认为是unknown。
    var ext = path.extname(pathName);
    ext = ext ? ext.slice(1) : 'unknown';

    //未知的类型一律用"text/plain"类型
    var contentType = mime[ext] || "text/plain";

    fs.stat(filePath, function(err, stats) {  //fs.stat:异步模式获取文件信息的语法格式
        if (err) {
            response.writeHead(404, { "Content-Type": "text/plain" });
            response.write("This request URL " + pathName + " was not found on this server.");
            response.end();
        }
        //没出错 并且文件存在
        if (!err && stats.isFile()) {
             readFile(filePath, contentType);
        }
        //如果路径是目录
        if (!err && stats.isDirectory()) {
            var html = "<head><meta charset = 'utf-8'/></head><body><ul>";
            //读取该路径下文件
            fs.readdir(filePath, function(err, files)  {
                if (err) {
                    console.log("读取路径失败！");
                } else {
                    //做成一个链接表，方便用户访问
                    var flag = false;
                for (var file of files) {
                //如果在目录下找到index.html，直接读取这个文件
                if (file === "register.html") {
                    readFile(filePath + (filePath[filePath.length-1]==='/' ? '' : '/') + 'register.html', "text/html");
                    flag = true;
                    break;
                }
                html += `<li><a href='${file}'>${file}</a></li>`;
            }
            if(!flag) {
                html += '</ul></body>';
                response.writeHead(200, { "Content-Type": "text/html" });
                response.end(html);
            }
        }
        });
        }

        //异步读取文件的函数
        function readFile(filePath, contentType){
            response.writeHead(200, { "Content-Type": contentType });
            //建立流对象，读文件
            var stream = fs.createReadStream(filePath);
            //错误处理
            stream.on('error', function() {
                response.writeHead(500, { "Content-Type": contentType });
                response.end("<h1>500 Server Error!</h1>");
            });
            //读取文件
            stream.pipe(response);
        }
    })
}

//创建服务
var httpServer = http.createServer(processRequest);
// 端口
var port = 8080;

httpServer.listen(port, function() {
    console.log(`App is running at port:${port}`);
    cp.exec(`Explorer http://localhost:${port}`, function () {//自动打开浏览器

    });
});