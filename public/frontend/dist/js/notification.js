function showToastMessage(message) {
    if (typeof message !== "undefined" && message.type && message.text) {
        toastr.options = {
            closeButton: true,
            debug: false,
            newestOnTop: true,
            progressBar: true,
            positionClass: "toast-top-right",
            preventDuplicates: true,
            onclick: null,
            showDuration: "300",
            hideDuration: "1000",
            timeOut: "5000",
            extendedTimeOut: "1000",
            showEasing: "swing",
            hideEasing: "linear",
            showMethod: "fadeIn",
            hideMethod: "fadeOut",
        };

        // Thêm lớp CSS tùy chỉnh cho từng loại
        const toast = toastr[message.type](message.text);
        if (message.type === "success") {
            $(".toast-success").css({
                backgroundColor: "#28a745", // Màu nền
                color: "#fff", // Màu chữ
            });
        } else if (message.type === "error") {
            $(".toast-error").css({
                backgroundColor: "#dc3545",
                color: "#fff",
            });
        } else if (message.type === "warning") {
            $(".toast-warning").css({
                backgroundColor: "#ffc107",
                color: "#212529",
            });
        } else if (message.type === "info") {
            $(".toast-info").css({
                backgroundColor: "#17a2b8",
                color: "#fff",
            });
        }
    }
}
