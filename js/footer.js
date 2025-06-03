function adjustGoTopPosition() {
  // 僅在寬度小於 768px 時執行
  if (window.innerWidth < 768) {
    const $visibleBottomSheet = $('.bottom-sheet:visible');

    if ($visibleBottomSheet.length > 0) {
      const bottomHeight = $visibleBottomSheet.outerHeight(true); // 含 margin
      $('#go-top').css('bottom', bottomHeight + 16); // 避開 bottom-sheet
    } else {
      $('#go-top').css('bottom', '16px'); // 預設底部距離
    }
  } else {
    // 在桌機模式還原預設樣式
    $('#go-top').css('bottom', '36px'); // 或是你桌面版的 px(36)
  }
}


$(document).ready(function () {
  adjustGoTopPosition();
  
  $("#go-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 500);
  });
});