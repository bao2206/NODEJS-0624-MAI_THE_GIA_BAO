const multer = require("multer");
const path = require("path");
const fs = require("fs");

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

const uploadImage = (type) => {
  return multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, `../../public/uploads/${type}`);
        // Create the directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
      },
      filename: function (req, file, cb) {
        cb(
          null,
          file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
      },
    }),
    limits: { fileSize: 1000000 }, // Limit file size to 1MB
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    },
  }).single("image"); // Adjust the fieldname to your form field name
};

const uploadProductImages = (type) => {
  return multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, `../../public/uploads/${type}`);
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
      },
      filename: function (req, file, cb) {
        cb(
          null,
          file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
      },
    }),
    limits: { fileSize: 60000000 },
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    },
  }).fields([
    { name: "image", maxCount: 1 }, // Ảnh chính
    { name: "images", maxCount: 10 }, // Ảnh chi tiết
  ]);
};

module.exports = { uploadImage, uploadProductImages };
