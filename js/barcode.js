$(document).ready(function () {
  $(".barcode").click(function () {
    $("#barcode-full").addClass("show");
  });

  $("#barcode-full i").click(function () {
    $(this).parent().removeClass("show");
  });
});
