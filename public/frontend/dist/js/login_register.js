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

});

// document.getElementById('signup-form').addEventListener('submit', function(event) {
//   event.preventDefault(); // Ngừng hành động mặc định của form (không gửi lại trang)

//   const form = this;

//   // Gửi form dữ liệu đi thông qua một yêu cầu Ajax
//   const formData = new FormData(form); // Dữ liệu form
//   console.log("Form Data:", formData);
//   // Gửi yêu cầu Ajax để lấy thông báo từ server
//   const xhr = new XMLHttpRequest();
//   xhr.open('POST', form.action, true);
//   xhr.onload = function() {
//     if (xhr.status === 200) {
//       // Xử lý kết quả trả về từ server
//       const data = JSON.parse(xhr.responseText);
      
//       if (data.success) {
//         document.getElementById('result-message').innerHTML = `<p style="color: green;">${data.message}</p>`;
//       } else {
//         document.getElementById('result-message').innerHTML = `<p style="color: red;">${data.message}</p>`;
//       }
//     } else {
//       // Xử lý nếu lỗi khi gửi dữ liệu
//       document.getElementById('result-message').innerHTML = `<p style="color: red;">An error occurred. Please try again.</p>`;
//     }
//   };

//   xhr.send(formData); // Gửi dữ liệu form
// });


document.addEventListener("DOMContentLoaded", function() {
  const username = sessionStorage.getItem('username');  // Lấy tên người dùng từ sessionStorage
  if (username) {
    document.getElementById('top-account').innerHTML = `Welcome, ${username}!`;
  } else {
    document.getElementById('top-account').innerHTML = `<a href="#modal-register" data-lightbox="inline" id="login-link">Sign up/Login</a>`;
  }
});