const multer = require("multer"); //Imports multer
const fs = require("fs"); //fs- file system
const path = require("path"); //path = file path

const storage = multer.diskStorage({
  //To store  in our given path and storage. HAS TWO PARTS, DESTINATION AND FILENAME.
  //DESTINATION IS WHERE TO SAVE AND FILENAME IS HOW TO STORE
  destination: (req, file, cb) => {
    let fileDestination = "public/uploads/"; //Where to make this folder. THIS IS INSIDE STORAGE
    //here, uploads file must be within public
    //check if directory exists
    //THE IF ELSE IS O CHECK THE FILE EXISTENCE
    if (!fs.existsSync(fileDestination)) {
      fs.mkdirSync(fileDestination, { recursive: true }); //recursive-true creates sub folders
      //recursive:true means it creates parent folder as well as sub folder
      cb(null, fileDestination); //cb is the call back function
      //if error = null, if no error = return to fileDestination
    } else {
      cb(null, fileDestination);
    }
  },
  filename: (req, file, cb) => {
    let filename = path.basename(
      file.originalname,
      path.extname(file.originalname)
    );
    //path.basename(folder/abc.jpg)
    //return abc.jpg
    //path.basename(folder/abc.jpg,.jpg)
    //return abc
    //say full name = photo.png
    //then original name = full name = photo.png
    // ext name = extension name = .png
    // and base name = name without extension = photo
    let ext = path.extname(file.originalname);
    cb(null, filename + "_" + Date.now() + ext);
  },
});

let imageFilter = (req, file, cb) => {
  if (
    !file.originalname.match(
      /\.(jpg|png|gif|jpeg|svg|JPG|PNG|GIF|JPEG|SVG|jfif)$/
    )
  ) {
    return cb(new Error("You can upload image file only"), false);
  } else {
    cb(null, true);
  }
};

let upload = multer({
  storage: storage, //This second storage is the above const storage which gives destination and filename
  fileFilter: imageFilter,
  limits: {
    fileSize: 2048000, //2MB; Can be changed
  },
});

module.exports = upload;
