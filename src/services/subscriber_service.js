const MainModel = require("../models/subscriber_model");
const nodemailer = require("nodemailer");
require('dotenv').config();
class MainService{
    saveEmailAndSendNotification = async(email)=>{
        console.log("Check check");
        const status = "active";
        console.log(email, status);
        await MainModel.create({email, status});
        
        console.log("Success");
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            }
        });
        console.log(transporter);
        const info = await transporter.sendMail({
            from: '"Ecommerce" <baopro2206@gmail.com>',  
            to: email,                                      
            subject: "Thank you for subscribing!",          
            text: "You have successfully subscribed to our newsletter.", 
            html: "<b>Thank you for subscribing!</b>",      
          });
        console.log("Create success");
        return info;
    }
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