document.addEventListener('DOMContentLoaded', function() {


  // Lắng nghe sự kiện click vào link với id 'login-link'
  document.getElementById('login-link').addEventListener('click', function(event) {
    event.preventDefault(); // Ngừng hành động mặc định (không chuyển hướng)
    openLoginModal();
  });

  // Lắng nghe sự kiện click vào link 'Sign up' để chuyển qua phần đăng ký
  document.getElementById('toggle-signup').addEventListener('click', function(event) {
    event.preventDefault();
    showSignupSection();
  });

  // Lắng nghe sự kiện click vào link 'Login' để chuyển qua phần đăng nhập
  document.getElementById('toggle-login-link').addEventListener('click', function(event) {
    event.preventDefault();
    showLoginSection();
  });

  // Example usage of logout function
 

  // Mở modal đăng nhập
  function openLoginModal() {
    if (typeof $.fn.magnificPopup !== 'undefined') {
      $.magnificPopup.open({
        items: {
          src: '#modal-register', // Chỉ định modal đăng nhập
          type: 'inline'
        },
        midClick: true // Cho phép mở popup khi click vào liên kết
      });
    } else {
      console.error('Magnific Popup library is not loaded.');
    }
  }

  // Hiển thị phần đăng ký và ẩn phần đăng nhập
  function showSignupSection() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('signup-section').style.display = 'block';
    document.getElementById('toggle-text').style.display = 'none';
    document.getElementById('toggle-login').style.display = 'block';
  }

  // Hiển thị phần đăng nhập và ẩn phần đăng ký
  function showLoginSection() {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('signup-section').style.display = 'none';
    document.getElementById('toggle-text').style.display = 'block';
    document.getElementById('toggle-login').style.display = 'none';
  }

  // Function to handle logout
  

  $('#login-form').click(function (e) {
    e.preventDefault();
    let username = $('#login-form-username').val();
    let password = $('#login-form-password').val();
  
    console.log(username);
    console.log(password);
  
    let link = '/account/signin';
    $.ajax({
      type: "post",
      url: link,
      data: {
        emailOrUsername: username,
        password
      },
      dataType: "json",
      success: function (response) {
        const { success, message, user } = response;
  
        if (!success) {
          // Thông báo lỗi nếu đăng nhập thất bại
          showToastMessage({
            type: 'error',
            text: message
          });
        } else {
          // Thông báo thành công nếu đăng nhập thành công
          showToastMessage({
            type: 'success',
            text: `Welcome, ${user.username}!`
          });
  
          // Chuyển hướng sau khi đăng nhập thành công
          setTimeout(() => {
            window.location.href = '/';
          }, 1500); // Đợi 1.5s trước khi chuyển hướng
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Xử lý khi xảy ra lỗi server hoặc lỗi kết nối
        showToastMessage({
          type: 'error',
          text: "An error occurred. Please try again later."
        });
        console.error("AJAX Error:", textStatus, errorThrown);
      }
    });
  });
  


});

