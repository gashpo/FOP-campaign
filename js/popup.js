$(document).ready(function () {
  $("[for]").click(function () {
    // 開啟 overlay
    $(".overlay").remove();
    $("body").append('<div class="overlay"></div>');

    // 開啟 popup
    let actionValue = $(this).attr("for");

    if ($("body").find(".popup.show").length > 0) {
      $(".popup").removeClass("show");

      setTimeout(() => {
        $("#" + actionValue).addClass("show");
        if (actionValue === "popup-success") {
          startConfettiInterval();
        } else {stopConfettiInterval();}
      }, 300);
    } else if ($("body").find(".popup.full").length > 0) {
      $(".popup").removeClass("show");
      $("#" + actionValue).addClass("show");
      if (actionValue === "popup-success") {
        startConfettiInterval();
      } else {stopConfettiInterval();}
    } else {
      $(".popup").removeClass("show");
      $("#" + actionValue).addClass("show");
      if (actionValue === "popup-success") {
        startConfettiInterval();
      } else {stopConfettiInterval();}
    }
  });

  // 關閉 popup
  $(document).on("click", ".action i[action='close']", function () {
    $(".overlay").remove();
    $(".popup").removeClass("show");
  });
});
