import { NextFunction, Response } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/media/");
  },
  filename: function (req, file, cb) {
    const extension = file.originalname.split(".").pop();
    const filename = `${uuidv4()}.${extension}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 12 * 1024 * 1024,
  },
});

const uploadMultiple = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "verificationFront", maxCount: 1 },
  { name: "verificationBack", maxCount: 1 },
]);

const ProfileFilesUploadMiddleware = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    uploadMultiple(req, res, (err) => {
      if (err) {
        if (
          err instanceof multer.MulterError &&
          err.code === "LIMIT_FILE_SIZE"
        ) {
          return res.status(400).send({
            status: 400,
            success: false,
            message: "File size limit exceeded (12MB max per file)",
            error: "LargeFileError: " + err.message,
          });
        }
        return res.status(400).send({
          status: 400,
          success: false,
          message: "An error occurred while uploading files",
          error: "FileUploadError: " + err.message,
        });
      }
      next();
    });
  } catch (ex: any) {
    return res.status(500).send({
      status: 500,
      success: false,
      message: "An error occurred while uploading files",
      error: "ServerError",
    });
  }
};

export default ProfileFilesUploadMiddleware;
