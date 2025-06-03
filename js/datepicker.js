$(document).ready(function () {
  const $datepicker = $(".datepicker");
  const $dateInput = $(".date-input");
  const $yearInput = $datepicker.find(".year-input");
  const $monthInput = $datepicker.find(".month-input");
  // const $cancelBtn = $datepicker.parent().siblings(".datepicker-cancel");
  const $applyBtn = $datepicker.parent().siblings(".datepicker-apply");
  const $nextBtn = $datepicker.find(".next");
  const $prevBtn = $datepicker.find(".prev");
  const $dates = $datepicker.find(".dates");

  let selectedDate = new Date();
  let year = selectedDate.getFullYear();
  let month = selectedDate.getMonth();

  // 顯示 datepicker
  $dateInput.on("click", function () {
    $datepicker.show();
  });

  // 隱藏 datepicker
  // $cancelBtn.on("click", function () {
  //   $datepicker.hide();
  // });

  // 處理套用按鈕
  $applyBtn.on("click", function () {
    console.log(
      selectedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    );

    // 隱藏 datepicker
    //$datepicker.hide();
  });

  // 處理下一個月按鈕
  $nextBtn.on("click", function () {
    if (month === 11) year++;
    month = (month + 1) % 12;
    displayDates();
  });

  // 處理上一個月按鈕
  $prevBtn.on("click", function () {
    if (month === 0) year--;
    month = (month - 1 + 12) % 12;
    displayDates();
  });

  // 處理月份選擇變更
  $monthInput.on("change", function () {
    month = $(this).prop("selectedIndex");
    displayDates();
  });

  // 處理年份選擇變更
  $yearInput.on("change", function () {
    year = $(this).val();
    displayDates();
  });

  const updateYearMonth = () => {
    $monthInput.prop("selectedIndex", month);
    $yearInput.val(year);
  };

  const handleDateClick = function () {
    const $button = $(this);

    // 移除其他已選中的按鈕
    $dates.find(".selected").removeClass("selected");
    $dates.find(".today").removeClass("today");

    // 標記選中的按鈕
    $button.addClass("selected");

    // 設置選擇的日期
    selectedDate = new Date(year, month, parseInt($button.text()));
  };

  const displayDates = () => {
    updateYearMonth();

    // 清空日期區域
    $dates.empty();

    // * 顯示上個月的最後一週
    const lastOfPrevMonth = new Date(year, month, 0);
    for (let i = 0; i <= lastOfPrevMonth.getDay(); i++) {
      const text = lastOfPrevMonth.getDate() - lastOfPrevMonth.getDay() + i;
      $dates.append(createButton(text, true, -1));
    }

    // * 顯示當前月份的日期
    const lastOfMonth = new Date(year, month + 1, 0);
    for (let i = 1; i <= lastOfMonth.getDate(); i++) {
      const $button = createButton(i, false);
      $button.on("click", handleDateClick);
      $dates.append($button);
    }

    // * 顯示下個月的第一週
    const firstOfNextMonth = new Date(year, month + 1, 1);
    for (let i = firstOfNextMonth.getDay(); i < 7; i++) {
      const text = firstOfNextMonth.getDate() - firstOfNextMonth.getDay() + i;
      $dates.append(createButton(text, true, 1));
    }
  };

  const createButton = (text, isDisabled = false, type = 0) => {
    const currentDate = new Date();
    let comparisonDate = new Date(year, month + type, text);

    const isToday =
      currentDate.getDate() === text &&
      currentDate.getFullYear() === year &&
      currentDate.getMonth() === month;

    const selected = selectedDate.getTime() === comparisonDate.getTime();

    return $("<span>")
      .text(text)
      .toggleClass("disabled", isDisabled)
      .toggleClass("today", isToday && !isDisabled)
      .toggleClass("selected", selected);
  };

  displayDates();
});
