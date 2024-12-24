document.addEventListener('DOMContentLoaded', function () {
    // Event delegation for dynamically added elements
    document.body.addEventListener('click', function (event) {
      if (event.target && event.target.id === 'logout-link') {
        event.preventDefault(); // Ngừng hành động mặc định
        logout(); // Gọi hàm logout
      }
    })}
  )
  function logout() {
    $.ajax({
      type: "post",
      url: "/account/logout",
      dataType: "json",
      success: function (response) {
        const { success, message } = response;
        if (success) {
          showToastMessage({
            type: 'success',
            text: message,
          });
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        } else {
          showToastMessage({
            type: 'error',
            text: message,
          });
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        showToastMessage({
          type: 'error',
          text: "An error occurred. Please try again later.",
        });
        console.error("AJAX Error:", textStatus, errorThrown);
      },
    });
  }
