$('#signup-form').on('submit', function(e) {
  e.preventDefault();

  let username = $('#signup-form-username').val();
  let email = $('#signup-form-email').val();
  let password = $('#signup-form-password').val();

  console.log("Signup data:", { username, email, password });

  $.ajax({
    type: "POST",
    url: '/account/signup',
    data: {
      username: username,
      email: email,
      password: password
    },
    dataType: "json",
    success: function(response) {
      // Handle all responses where status is 2xx
      const { success, message } = response;
      console.log("Response:", response);

      if (success) {
        showToastMessage({
          type: 'success',
          text: "Thank you for signing up! Redirecting..."
        });

        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        // Handle unexpected cases where success is false but status is 200
        showToastMessage({
          type: 'error',
          text: message || "An unexpected error occurred. Please try again."
        });
      }
    },
    error: function(jqXHR) {
      // Handle 4xx and 5xx responses here
      let message = "An error occurred. Please try again later.";

      if (jqXHR.status === 400) {
        message = jqXHR.responseJSON?.message || "Invalid data. Please check your input.";
      } else if (jqXHR.status === 500) {
        message = "Internal server error. Please try again later.";
      }

      showToastMessage({
        type: 'error',
        text: message
      });
    }
  });
});
