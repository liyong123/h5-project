define(function () {
   var openModal = function (msg) {
       var modalHtmlStr = "<div class='mask' ></div>"+
           "<div id='modalContent1' class='modalContent'>"+
               " <span></span>"+
               " <button id='closeModalBtn' >关闭</button>"+
           "</div>";

       $(".mainContent").append(modalHtmlStr);
       $("#modalContent1").find("span").html(msg);
       $("#closeModalBtn").on("click", function () {
           $(".mask").remove();
           $("#modalContent1").remove();
           if(msg === "注册成功"){
               window.location.href = "/login.html"
           }else if (msg === "登录成功") {
               window.location.href = "/index.html"
           }
       })
   };


   return {
       openModal: openModal
   }
});