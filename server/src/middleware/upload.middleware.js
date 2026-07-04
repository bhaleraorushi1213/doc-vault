import multer from "multer";
import path from "path";
import fs from "fs";

// files land in /uploads at the project root - create it if it doesn't exist yet
const UPLOAD_DIR = path.join(process.cwd(), "uploads");   // process.cwd() locates root folder and search 'uploads' folder
if (!fs.existsSync(UPLOAD_DIR)) {                         // fs.existsSync() checks if the folder is missing.  
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });          // If it is missing, fs.mkdirSync safely creates it. 
}                                                         // {recursive: true} ensures parent folders are built if needed

const MIME_TO_EXT = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "application/vnd.ms-excel": ".xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "text/plain": ".txt",
  "text/csv": ".csv",
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {                       // Tells Multer to save uploaded files directly to the local disk inside the uploads directory.
    cb(null, UPLOAD_DIR);
  },
  
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;  // prefix with timestamp + random suffix so two uploads with the same
    const ext = MIME_TO_EXT[file.mimetype] || "";                              // original filename never collide on disk eg. 1719875400000-482910384.pdf
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// keep this list narrow on purpose - widen it deliberately, don't default to "anything"
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "text/csv",
  "image/png",
  "image/jpeg",
  "image/jpg",
];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type '${file.mimetype}' is not allowed`), false);
  }
}; 
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB cap - adjust to your needs
  },
});