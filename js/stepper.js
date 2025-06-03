$(document).ready(function () {
  $(".stepper-wrapper").each(function () {
    const $wrapper = $(this);
    const $minus = $wrapper.find(".step-minus");
    const $plus = $wrapper.find(".step-plus");
    const $count = $wrapper.find(".count");
    const $helper = $wrapper.find(".helper");
    const $helperPoints = $helper.find("span");

    const $productInfo = $wrapper.closest(".product-info");
    const $points = $productInfo.find(".points h5 span");

    const unitPoints = parseInt($points.text().replace(/,/g, ""), 10); // 去除原始千分位格式

    function updateHelper() {
      let quantity = parseInt($count.val(), 10);
      if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
        $count.val(quantity);
      }

      const totalPoints = unitPoints * quantity;
      $helperPoints.text(totalPoints.toLocaleString()); // ✅ 顯示千分位格式
      $helper.toggle(quantity > 1);
      $minus.prop("disabled", quantity <= 1);
    }

    function updateCount(change) {
      let quantity = parseInt($count.val(), 10) + change;
      if (quantity < 1) quantity = 1;
      $count.val(quantity);
      updateHelper();
    }

    $plus.click(function () {
      updateCount(1);
    });

    $minus.click(function () {
      updateCount(-1);
    });

    $count.on("input change", function () {
      updateHelper();
    });

    updateHelper();
  });
});
