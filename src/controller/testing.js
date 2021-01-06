import multer from "multer";
import path from "path";
import shortid from "shortid";
import fs from "fs";
import Testing from "../model/testing.js";

const __dirname = path.resolve();

export const uploadImage = (req, res) => {
  try {
    //Destination & Filename
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path.join(__dirname + "\\src", "uploads"));
      },
      filename: function (req, file, cb) {
        cb(null, shortid.generate() + "-" + file.originalname);
      },
    });

    //File Filter
    const fileFilter = function (req, file, callBack) {
      const allowExtention = [".png", ".jpeg", ".jpg", ".gif"];
      const extension = path.extname(file.originalname);
      // if (allowExtention.includes(extension)) {
      if (extension == ".pdf") {
        callBack(null, true);
      } else {
        callBack(
          {
            success: false,
            message:
              "Invalid image type. Only jpg, png image files are allowed.",
          },
          false
        );
      }
    };

    //Object For Upload
    let obj = {
      storage: storage,
      fileFilter: fileFilter,
      limits: {
        fileSize: 2 * 1024 * 1024, //2MB
      },
    };

    //Upload Object
    const upload = multer(obj).single("TestingImage");

    //Base64 Convert
    const base64_encode = (file) => {
      const bitmap = fs.readFileSync(file);
      return new Buffer(bitmap).toString("base64");
    };

    //Error Handling For File
    upload(req, res, (error) => {
      //Error
      if (error) {
        if (error.code == "LIMIT_FILE_SIZE") {
          error.message = "File Size is too large. Allowed fil size is 2MB";
          error.success = false;
        }
        return res.status(500).json(error);
      }
      //Success
      else {
        const base64 = base64_encode(req.file.path);
        const testing = new Testing({ base64image: base64 });
        testing.save((error, image) => {
          if (error) return res.status(400).json({ error });
          if (image) {
            res.status(201).json({ image });
          }
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

//data:image/jpeg;base64,
