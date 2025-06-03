$(document).ready(function () {
  $(".menu-toggle").click(function () {
    $("header").toggleClass("open");
  });

  $("#user").click(function (event) {
    event.stopPropagation();
    if ($(window).width() >= 768) {
      $(".select").toggleClass("active");
    } else {
      if ($("#mobile-menu").length === 0) {
        $("body").append(
          `
          <div id="mobile-menu">
            

            <div class="container">
              <div class="balance">
                <img src="images/Logo_Coin.svg">
                <h6>9,999</h6>
              </div>
              <ul class="mobile-menu">
                <li onclick="location.href='myPoints.html'"><i class="material-symbols-outlined">receipt_long</i>我的紅利</li>
                <li onclick="location.href='myTickets.html'"><i class="material-symbols-outlined">folder_open</i>我的票夾</li>
                <li class="divider"></li>
                <li onclick="location.href='member.html'"><i class="material-symbols-rounded">person</i>會員資料</li>
                <li onclick="location.href='index.html'"><i class="material-symbols-outlined">logout</i>登出</li>
              </ul>
            </div>

            <footer>
              <div class="info">
                <div class="logo"><a href="index.html"><img src="images/Logo-dark.svg"></a></div>
                <ul class="menu">
                  <li class="footer-textlink">隱私權政策</li>
                  <li class="footer-textlink">服務條款</li>
                  <li class="footer-textlink">紅利規章</li>
                </ul>
              </div>
              <copyright>2025 GASH POINT Co., Ltd. All Rights Reserved.</copyright>
            </footer>
          </div>
          `
        );
      } else {
        $("#mobile-menu").remove();
      }
    }
  });

  // 點擊其他地方關閉 .select
  $(document).click(function () {
    $(".select").removeClass("active");
  });

  // 登入登出示意
  $("#login").click(function () {
    $("body").addClass("loggedin");
  });
  $("#logout").click(function () {
    $("body").removeClass("loggedin");
  });

  // 小網隱藏header
  var prev = 0;
  $(window).on("scroll", function () {
    var scrollTop = $(window).scrollTop();
    if (scrollTop < 100) {
      $("header").removeClass("hide");
    } else {
      $("header").toggleClass("hide", scrollTop > prev);
      prev = scrollTop;
    }
  });
});

function goToExchange() {
  sessionStorage.setItem("scrollToExchange", "true");
  window.location.href = "index.html";
}

function goToCollect() {
  sessionStorage.setItem("scrollToCollect", "true");
  window.location.href = "index.html";
}
