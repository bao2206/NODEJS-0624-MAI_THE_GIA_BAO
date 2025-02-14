const MainService = require("../services/account_service");
const MailService = require("../services/subscriber_service");
// const fs = require("fs");
// const path = require("path");
const Validator = require("../utils/Validation");
const nameRoute = "account";
class ItemController {
  Logout = async(req, res, next) =>{
   
    //logout cookie 
    try {
      // Clear the cookie that stores the user's session
      removeCookie(res, "user");
      return res.status(200).json({ success: true, message: "Logged out successfully." });
    } catch (error) {
      console.log("Catch")
      console.error("Error during logout:", error);
      return res.status(500).json({ success: false, message: "Error server, please try again." });
    }
  }
 
  SignUp = async(req, res, next) =>{
    // console.log("Before to try", req.body);
    const validator = new Validator(req.body);
    const validationResult = validator.validateRegistration();
    
    
    if (!validationResult) {
      return res.status(400).json({success: false, message: "Invalid data. Please check the fields again"});
    }
    if (!validator.isPasswordLongEnough("password")) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long." });
    }
  
    if (!validator.isPasswordStrong("password")) {
      return res.status(400).json({ success: false, message: "Password must contain at least one number and one special character." });
    }

    try {
      const {username, email, password} = req.body;
      const existingUser = await Promise.all([
        MainService.getUserByEmail({ email }),
        MainService.getUserByUsername({ username })
      ]);
      
      const [existingUserEmail, existingUsername] = existingUser;

      if(existingUserEmail) return res.status(400).json({ success: false, message: "Email already in use." });
      if(existingUsername) return res.status(400).json({ success: false, message: "Username already in use." });

      const newUser = await MainService.createAccount(username, email, password);
      console.log("New user", newUser);
      // Trả về kết quả
      if (newUser) {
        await MailService.sendWelcomeEmail(email, username);
        return res.status(201).json({ success: true, message: "Successful." });
      } else {
        return res.status(400).json({ success: false, message: "Have an error, please try again." });
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      return res.status(500).json({ success: false, message: "Error server, please try again." });
    }
  }
  SignIn = async(req, res, next) => {
  const validator = new Validator(req.body);
  
  const isValid = validator.validateLogin();
 
  try {
    if (!isValid) {
      return res.status(400).json({ success: false, message: "Please provide valid email or username and password." });
    }
    // Tìm người dùng theo email hoặc username
    const { emailOrUsername, password } = req.body;
    const existingUser = await MainService.getUserByEmailOrUsername({ emailOrUsername });


    if (!existingUser) {
      return res.status(400).json({ success: false, message: "User not found." });
    }

    // So sánh mật khẩu đã nhập với mật khẩu trong cơ sở dữ liệu
    const isPasswordMatch = await existingUser.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(400).json({ success: false, message: "Incorrect password." });
    }
    const roleOfUser = MainService.getRoleOfUser(existingUser);
   
    console.log(roleOfUser);
    // 
    res.cookie('user', JSON.stringify({
      username: existingUser.username,
      email: existingUser.email,
      role: roleOfUser
    }), {
      httpOnly: true,  
      secure: false,   
      maxAge: 3600000, 
      sameSite: 'strict' 
    });
   
    return res.status(201).json({ success: true, message: "Login successful.", user: existingUser });
    // return res.redirect("/");
  } catch (error) {
    console.error("Error during login:", error);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: "Server error, please try again." });
    }
  }
  }
}
function removeCookie(res, cookieName) {
  res.cookie(cookieName, "", { expires: new Date(0), path: '/' });
}
module.exports = new ItemController();
