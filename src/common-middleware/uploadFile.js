import multer from "multer";
import path from "path";
import shortid from "shortid";

const __dirname = path.resolve();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname + "\\src", "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

export default upload;
