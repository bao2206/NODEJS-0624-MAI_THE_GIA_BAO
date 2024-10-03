const MainService = require("../services/settings_service");
const fs = require("fs");
const path = require("path");
const { asyncHandle } = require("../utils/asyncHandle"); // Add async handler if not used yet
const { uploadImage} = require("../middleware/upload");

const nameRoute = "settings";

class MailController {
  // Lấy tất cả cài đặt
  getAll = async (req, res, next) => {
    const setting = await MainService.getAllSetting();
    let stringParse = JSON.parse(setting.name);
    res.render(`admin/pages/${nameRoute}/index`, { setting: stringParse });
  };

  // Cập nhật cài đặt
  setting = [
    uploadImage("settings"), 
    asyncHandle(async (req, res, next) => {
    
      req.file ? (req.body.image = req.file.filename) : (req.body.image = req.body.old_image);
      console.log(req.body.image);
      const setting = await MainService.getAllSetting();;
      let item = JSON.parse(setting.name);
      console.log(item)

      if (req.file && item.image) {
        const imagePath = path.join(`public/uploads/${nameRoute}`, item.image.replace(`/uploads`, ""));
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Error deleting image:", err);
          }
        });
      }
      await MainService.update(JSON.stringify(req.body));
      res.redirect('/admin/settings');
    })
  ];
}

module.exports = new MailController();
