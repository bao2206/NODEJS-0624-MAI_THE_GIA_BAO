$('#signup-form').on('submit', function(e) {
  e.preventDefault();
  let username = $('#signup-form-username').val();
  let email = $('#signup-form-email').val();
  let password = $('#signup-form-password').val();
 
  console.log("Signup data:", { username, email, password });
  
  $.ajax({
    type: "POST", // Uppercase POST is preferred
    url: '/account/signup',
    data: {
      username: username,
      email: email, // Fixed typo from 'emai' to 'email'
      password: password
    },
    dataType: "json",
    success: function(response) {
      const { success, message } = response;
      console.log("Response:", response);
      
      if (!success) {
        showToastMessage({
          type: 'error',
          text: message
        });
      } else {
        showToastMessage({
          type: 'success',
          text: `Thank you for signing up!`
        });

        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      showToastMessage({
        type: 'error',
        text: "An error occurred. Please try again later."
      });
      console.error("AJAX Error:", textStatus, errorThrown);
      console.error("Response:", jqXHR.responseText);
    }
  });
});