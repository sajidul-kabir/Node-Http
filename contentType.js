const path = require("path");
exports.getContentType = (filePath) => {
  const extname = path.extname(filePath);
  switch (extname) {
    case ".txt":
      return "text/plain";
    case ".html":
      return "text/html";
    case ".js":
      return "text/javascript";
    case ".css":
      return "text/css";
    case ".json":
      return "application/json";
    case ".png":
      return "image/png";
    case ".jpg":
      return "image/jpg";
    case ".wav":
      return "audio/wav";
    case ".mp4":
      return "video/mp4";
    default:
      return "application/octet-stream";
  }
};
