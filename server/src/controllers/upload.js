const cloudinary = require("cloudinary").v2;
const fs = require("fs");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

class Upload {
  static async upload(req, res) {
    try {
      const file = req.files.sampleFile;
      console.log("file", file);
      let result = await cloudinary.uploader.upload(
        file.tempFilePath,
        { folder: "news" },
        async (error) => {
          if (error) throw error;
          // console.log('file', file.tempFilePath)
          Upload.removeTmp(file.tempFilePath);
        }
      );
      return res.send({ success: true, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static removeTmp(path) {
    fs.unlink(path, (err) => {
      if (err) throw err;
    });
  }
}

module.exports = Upload;
