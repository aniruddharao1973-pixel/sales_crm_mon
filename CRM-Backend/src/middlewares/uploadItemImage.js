// CRM-Backend\src\middlewares\uploadItemImage.js

import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.resolve("public/uploads/items");

    // ✅ create folder automatically if not exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const fileName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;

    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG, WEBP images are allowed"), false);
  }
};

const uploadItemImage = multer({
  storage,
  fileFilter,

  // ✅ optional size limit (5MB)
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default uploadItemImage;
