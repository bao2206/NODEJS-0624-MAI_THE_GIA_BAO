const { validationResult } = require('express-validator');

class Validator {
  constructor(data) {
    this.data = data;
    this.errors = [];
  }


  isNotEmpty(field, fieldName) {
    if (!this.data[field] || this.data[field].trim() === "") {
      this.errors.push({ msg: `${fieldName} không được để trống.`, param: field });
    }
  }


  isPasswordLongEnough(field) {
    if (this.data[field] && this.data[field].length < 8) {
      this.errors.push({ msg: "Mật khẩu phải có ít nhất 8 ký tự.", param: field });
    }
  }


  isPasswordStrong(field) {
    const hasNumber = /\d/; // Kiểm tra có chữ số
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/; // Kiểm tra ký tự đặc biệt

    if (this.data[field]) {
      if (!hasNumber.test(this.data[field])) {
        this.errors.push({ msg: "Mật khẩu phải chứa ít nhất một chữ số.", param: field });
      }
      if (!hasSpecialChar.test(this.data[field])) {
        this.errors.push({ msg: "Mật khẩu phải chứa ít nhất một ký tự đặc biệt.", param: field });
      }
    }
  }

  
  validateRegistration() {
    this.isNotEmpty("username", "Tên người dùng");
    this.isNotEmpty("email", "Email");
    this.isNotEmpty("password", "Mật khẩu");
    this.isPasswordLongEnough("password");
    this.isPasswordStrong("password");

    return validationResult(this.errors);
  }

  
  validateLogin() {
    this.isNotEmpty("email", "Email");
    this.isNotEmpty("password", "Mật khẩu");

    return validationResult(this.errors);
  }
}

module.exports = Validator;
