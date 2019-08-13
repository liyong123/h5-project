define(['modal'],function (modal) {
    var URL = "/public/json/";
    var dataRequest = function (url, type, data, callback) {
       $.ajax({
           url: url,
           type: type || 'POST',
           data: data,
           dataType: 'json',
           beforeSend: function (xhr) {
               try{
                   var token = localStorage.getItem("token");
                   if (token) {
                       xhr.setRequestHeader("token", token);
                   }
               }catch(e){
                   console.log("tokenError：",e)
               }
           },
           success: function (res,status,xhr) {

               if (xhr.status === 200) {
                   if (res.code === 1 && typeof callback === 'function') {
                       callback(res)
                   }else if (res.code === 401){
                       modal.openModal("登录失效,请重新登录...");
                   }else {
                       //todo:....
                   }
               }
           },
           error: function (xhr,status,error) {
               if (xhr.status === 404){
                   modal.openModal(error)
               }else if (xhr.status === 500) {
                   modal.openModal(error)
               }else if (xhr.status === 401){
                   modal.openModal("登录失效,请重新登录...");
                   window.location.href = '/login.html'
               }
           }
       })

    };

    var uploadFile = function (url,type,data,callback) {
        $.ajax({
            url: url,
            type: type || 'POST',
            data: data,
            dataType: 'json',
            cache: false,
            processData: false,
            contentType: false,
            beforeSend: function (xhr) {
                try{
                    var token = localStorage.getItem("token");
                    if (token) {
                        xhr.setRequestHeader("token", token);
                    }
                }catch(e){
                    console.log("tokenError：",e)
                }
            },
            success: function (res,status,xhr) {

                if (xhr.status === 200) {
                    if (res.code === 1 && typeof callback === 'function') {
                        callback(res)
                    }else if (res.code === 401){
                        modal.openModal("登录失效,请重新登录...");
                    }else {
                        //todo:....
                    }
                }
            },
            error: function (xhr,status,error) {
                if (xhr.status === 404){
                    modal.openModal(error)
                }else if (xhr.status === 500) {
                    modal.openModal(error)
                }else if (xhr.status === 401){
                    modal.openModal("登录失效,请重新登录...");
                    window.location.href = '/login.html'
                }
            }
        })
    };

    return  {
        URL: URL,
        dataRequest: dataRequest,
        uploadFile: uploadFile
    }

});