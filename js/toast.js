$(".toast .close").click(function () {
    $(this).parent().remove();
})

function openToast() {
    $("body").append(`
        <div class="toast toast-success fadeout">
            <i class="material-symbols-outlined">check_circle</i>
            登入成功
        </div>
    `);
    setTimeout(() => {
        $(".toast.fadeout").remove();
    }, 5000);
}