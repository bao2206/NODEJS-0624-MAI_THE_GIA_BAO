class Validator {
  constructor(data) {
    this.data = data;
  }

  // Kiểm tra trường không trống
  isNotEmpty(field) {
    return this.data[field] && this.data[field].trim() !== "";  // Trả về true nếu không trống, false nếu trống
  }

  // Kiểm tra độ dài mật khẩu
  isPasswordLongEnough(field) {
    return this.data[field] && this.data[field].length >= 8; // Trả về true nếu mật khẩu dài đủ, false nếu không
  }

  // Kiểm tra mật khẩu mạnh (có số và ký tự đặc biệt)
  isPasswordStrong(field) {
    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (this.data[field]) {
      const isStrong = hasNumber.test(this.data[field]) && hasSpecialChar.test(this.data[field]);
      return isStrong;  // Trả về true nếu mật khẩu đủ mạnh, false nếu không
    }
    return false; // Nếu không có mật khẩu, trả về false
  }

  // Kiểm tra dữ liệu đăng ký
  validateRegistration() {
    const isUsernameValid = this.isNotEmpty("username");
    const isEmailValid = this.isNotEmpty("email");
    const isPasswordValid = this.isNotEmpty("password") ;
    return isUsernameValid && isEmailValid && isPasswordValid; // Trả về true nếu tất cả hợp lệ
  }

  // Kiểm tra dữ liệu đăng nhập
  validateLogin() {
    return this.isNotEmpty("emailOrUsername", "Email or Username") && this.isNotEmpty("password", "Password");  // Trả về true nếu hợp lệ, false nếu không
  }
}

module.exports = Validator;
