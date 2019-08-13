require.config({
    baseUrl: "public/js/lib",
    paths:{
        "jquery":'jquery-3.3.1',
        "rem": 'rem',
        "modal": 'modal',
        "request": 'common'
    }
});
require(['jquery', 'rem'], function ($, rem) {
    rem.rem();
    require(['modal', 'request'], function (modal, request) {
        var url = request.URL;
        function formSubmit() {
            var t = document.getElementById('telephone').value;//手机号
            var p = document.getElementById('pwd').value;//密码
            //手机号验证、值不能为空等 判断,如有缺漏请补充
            if (t === '' || p === ''){
                modal.openModal("手机号或密码不能为空！");
                return false
            }

            if (t !== ''&&(!(/^[1][3,4,5,7,8][0-9]{9}$/.test(t)))){
                modal.openModal("手机号码格式不正确！");
                return false
            }

            //todo: ajax接口联调（参数：t,p,...，考虑加密）
            //登录成功
            var params = {
                t: t,
                p: p
            };
            request.dataRequest( url+ "login.json","GET", params, function (res) {
                    var msg = res.msg;
                    var token = res.data.token;
                    localStorage.setItem("token",token);
                    modal.openModal(msg);
                }
            );


        }
        $("#loginBtn").on("click", function () {
            formSubmit()
        });

        $("#file").on("click", function () {
            var formData = new FormData();
            formData.append("file",$("#file")[0].files[0]);
            //todo:...
            request.uploadFile(url + "upload.json", "POST", formData, function (res) {
                var msg = res.msg;
                modal.openModal(msg);
            })
        })
    })
});




