$(document).ready(function () {
  /* 引入layout */
  // 確保 header 加載完成後才綁定事件
  $("#header-placeholder").load("layout/header.html", function () {
    $("#user").click(function () {
      if (window.innerWidth < 768) {
        if ($("#mobile-menu").length === 0) {
          // 引入 mobile-menu
          $("body").append('<div id="mobile-menu-placeholder"></div>');
          $("#mobile-menu-placeholder").load("layout/mobile-menu.html");
        } else {
          // 移除 mobile-menu
          $("#mobile-menu").remove();
        }
      }
    });
  });
  // $("#sidebar-placeholder").load("layout/sidebar.html");
  // $("#loading-placeholder").load("layout/loading.html");
  $("#footer-placeholder").load("layout/footer.html");
  $("#cookie-placeholder").load("layout/cookie.html");
});
