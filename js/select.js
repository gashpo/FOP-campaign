$(document).ready(function () {
  $(".select-dropdown").click(function (event) {
    event.stopPropagation();

    // 先關閉所有其他的 select
    $(".select-wrapper").not($(this).parent()).removeClass("open");

    // 切換當前 select
    $(this).parent().toggleClass("open");
    if ($(this).parent().hasClass("bottom_sheet") && $(window).width() < 768) {
      $(this).parent().find(".overlay").remove();
      $(this).parent().append('<div class="overlay"></div>');
    }
  });

  $(".select-items li").click(function () {
    let selectedHTML = $(this).html();
    let $wrapper = $(this).closest(".select-wrapper");

    $wrapper.find(".select-dropdown").html(selectedHTML);
    $wrapper.removeClass("open");

    $(this).closest(".select-wrapper").find(".overlay").remove();
  });

  $(document).click(function (event) {
    if (!$(event.target).closest(".select-wrapper").length) {
      $(".select-wrapper").removeClass("open");

      $(this).closest(".select-wrapper").find(".overlay").remove();
    }
  });

  $(document).on("click", ".select-wrapper i[action='close']", function () {
    $(".select-wrapper").removeClass("open");

    $(this).closest(".select-wrapper").find(".overlay").remove();
  });
});
