$(document).ready(function () {
  $(".tab-wrapper").each(function () {
    let $tabWrapper = $(this);
    let $tab = $tabWrapper.find(".tab");
    let $underline = $tabWrapper.find(".tab-underline");
    let $scrollLeftBtn = $tabWrapper.find(".tab-scroll-left");
    let $scrollRightBtn = $tabWrapper.find(".tab-scroll-right");
    let $tabItems = $tab.find(".tab-item");
    let $tabContainer = $tabWrapper.next(".tab-container");
    let $tabContents = $tabContainer.find(".tab-content");

    // 讓滾動更平滑
    $tab.css("scroll-behavior", "smooth");

    function checkScrollable() {
      let scrollLeft = $tab.scrollLeft();
      let maxScrollLeft = $tab[0].scrollWidth - $tab.outerWidth();

      $scrollLeftBtn.css("display", scrollLeft <= 0 ? "none" : "flex");
      $scrollRightBtn.css(
        "display",
        scrollLeft >= maxScrollLeft - 10 ? "none" : "flex"
      );
    }

    function updateUnderline() {
      let $activeTab = $tab.find(".tab-item.active");
      if ($activeTab.length) {
        let leftPos = $activeTab.position().left + $tab.scrollLeft();
        let width = $activeTab.outerWidth();
        $underline.css({ left: leftPos + "px", width: width + "px" });
      }
    }

    function scrollToTab($tabItem) {
      let tabLeft = $tabItem.position().left;
      let tabWidth = $tabItem.outerWidth();
      let tabScrollLeft = $tab.scrollLeft();
      let tabContainerWidth = $tab.outerWidth();

      if (tabLeft < 0) {
        $tab.scrollLeft(tabScrollLeft + tabLeft - 10);
      } else if (tabLeft + tabWidth > tabContainerWidth) {
        $tab.scrollLeft(
          tabScrollLeft + (tabLeft + tabWidth - tabContainerWidth) + 10
        );
      }
    }

    function updateTabContent(index) {
      $tabContents.hide().eq(index).show();
    }

    checkScrollable();
    updateUnderline();

    $(window).on("resize", function () {
      checkScrollable();
      updateUnderline();
    });

    $scrollRightBtn.click(function () {
      $tab.animate({ scrollLeft: "+=300px" }, 300, checkScrollable);
    });

    $scrollLeftBtn.click(function () {
      $tab.animate({ scrollLeft: "-=300px" }, 300, checkScrollable);
    });

    $tab.on("scroll", function () {
      checkScrollable();
      updateUnderline();
    });

    $tabItems.click(function () {
      let index = $(this).index();
      $tabItems.removeClass("active");
      $(this).addClass("active");
      updateUnderline();
      scrollToTab($(this));
      updateTabContent(index);
    });
  });
});
