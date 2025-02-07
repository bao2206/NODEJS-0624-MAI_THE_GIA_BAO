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


  
  $('#login-form').on('submit', function(e) {
    e.preventDefault();
    
    const username = $('#login-form-username').val();
    const password = $('#login-form-password').val();

    $.ajax({
      type: "POST",
      url: '/account/signin',
      data: {
        emailOrUsername: username,
        password: password
      },
      dataType: "json",
      success: function(response) {
        const { success, message, user } = response;
        
        if (success) {
          showToastMessage({
            type: 'success',
            text: `Welcome, ${user.username}!`
          });
          setTimeout(() => {
            window.location.href = '/';
          }, 1500);
        } else {
          showToastMessage({
            type: 'error',
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
    });
  });
  


});

