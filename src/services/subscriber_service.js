const MainModel = require("../models/subscriber_model");
const nodemailer = require("nodemailer");
require('dotenv').config();
class MainService{
    constructor(){
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // Không dùng SSL
            auth: {
              user: process.env.EMAIL_USERNAME, // Email của bạn
              pass: process.env.EMAIL_PASSWORD, // Mật khẩu ứng dụng (App Password)
            },
        });
    };
    saveEmailAndSendNotification = async(email)=>{
        const status = "active";
        console.log(email, status);
        await MainModel.create({ email, status });

        console.log("Success");
    
        const info = await this.transporter.sendMail({
          from: '"Ecommerce" <baopro2206@gmail.com>', // Địa chỉ email gửi
          to: email, // Địa chỉ email nhận
          subject: "Thank you for subscribing!", // Tiêu đề email
          text: "You have successfully subscribed to our newsletter.", // Nội dung dạng text
          html: "<b>Thank you for subscribing!</b>", // Nội dung dạng HTML
        });
    
        console.log("Create success");
        return info;
    }
    sendWelcomeEmail = async (email, username ) => {
        try {
            const mailOptions = {
              from: '"Ecommerce" <your-email@example.com>', // Địa chỉ email gửi
              to: email, // Địa chỉ email nhận
              subject: "Welcome to Our Service!", // Tiêu đề email
              text: `Hi ${username},\n\nThank you for signing up to our service! We're glad to have you onboard.\n\nBest regards,\nThe Team`, // Nội dung dạng text
              html: `<b>Hi ${username},</b><br><br>Thank you for signing up to our service! We're glad to have you onboard.<br><br>Best regards,<br>The Team`, // Nội dung dạng HTML
            };
      
            const info = await this.transporter.sendMail(mailOptions);
            console.log("Email sent: ", info.messageId);
      
            return info;
          } catch (error) {
            console.error("Error sending welcome email:", error);
            throw error;
          }
        };
      
        
    countStatus = async (name = "") => {
        //
        let status = {};
        if (name != "") status = { status: name };
        return await MainModel.countDocuments(status);
    };
    getEleById = async (id) => {
        return await MainModel.findById(id);
    };
    getAllItems = async (filter) => {
        return await MainModel.find(filter);
    };
    updateItemById = async (id, updatedData) => {
        const item = await MainModel.findByIdAndUpdate(id, updatedData, {
          new: true,
        });
        return item;
      };
    deleteItemById = async (id) => {
        return await MainModel.findByIdAndDelete(id);
    };
}
module.exports = new MainService();