var swiper = new Swiper(".collect-swiper", {
  effect: "cards",
  direction: "vertical",
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    type: "fraction",
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  grabCursor: false,
  allowTouchMove: false,
  spaceBetween: 30,
  breakpoints: {
    768: {
      grabCursor: true,
      allowTouchMove: true,
    },
  },
});
