document.addEventListener('DOMContentLoaded', function() {

    // Hiển thị modal quên mật khẩu
    document.getElementById('forgot-password-link').addEventListener('click', function(event) {
      event.preventDefault();
      openForgotPasswordModal();
    });
  
    // Quay lại màn hình đăng nhập
    document.getElementById('back-to-login').addEventListener('click', function(event) {
      event.preventDefault();
      openLoginModal();
    });
  
    // Mở modal Forgot Password
    function openForgotPasswordModal() {
      if (typeof $.fn.magnificPopup !== 'undefined') {
        $.magnificPopup.open({
          items: { src: '#modal-forgot-password', type: 'inline' },
          midClick: true
        });
      } else {
        console.error('Magnific Popup library is not loaded.');
      }
    }
  
    // Xử lý quên mật khẩu (AJAX)
    $('#forgot-password-form').on('submit', function(e) {
      e.preventDefault();
  
      const email = $('#forgot-password-email').val();
  
      $.ajax({
        type: "POST",
        url: '/account/forgot-password',
        data: { email },
        dataType: "json",
        success: function(response) {
          showToastMessage({ type: 'success', text: response.message });
          setTimeout(() => { $.magnificPopup.close(); }, 2000);
        },
        error: function(jqXHR) {
          let message = "An error occurred. Please try again later.";
          if (jqXHR.status === 400) message = jqXHR.responseJSON?.message || "Invalid email.";
          showToastMessage({ type: 'error', text: message });
        }
      });
    });
  
  });
  