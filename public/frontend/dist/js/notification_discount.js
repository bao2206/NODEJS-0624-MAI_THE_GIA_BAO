document.addEventListener('DOMContentLoaded', function () {
    $(`#discountForm`).on('submit', function (e) { 
        e.preventDefault();

        const applyCoupon = $('#applyCoupon').val();
        $.ajax({
            type: "POST",
            url: '/cart/update-discount',
            data: {
                discountCode: applyCoupon,
            },
            dataType: "json",
            success: function(response){
                const {success, message} = response;
                console.log(success);
                console.log(message);
                if (success) {
                    showToastMessage({
                      type: 'success',
                      text: `Apply success`
                    });
                    setTimeout(() => {
                      window.location.href = '/cart';
                    }, 30000);
                  } else {
                    showToastMessage({
                      type: 'warning',
                      text: message
                    });
                  }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                  showToastMessage({
                    type: 'error',
                    text: "An error occurred. Please try again later."
                  });
                  console.error("AJAX Error:", textStatus, errorThrown);
            }
        })
    });
});