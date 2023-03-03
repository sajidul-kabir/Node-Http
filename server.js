const http = require("http");
const fs = require("fs");
const { logger } = require("./logger");
const { getContentType } = require("./contentType");
const { myError } = require("./myError");

const server = http.createServer(async (req, res) => {
  try {
    if (req.method !== "GET") {
      throw new Error("Wrong method");
    }

    const filePath = __dirname + req.url;
    const stats = await fs.promises.lstat(filePath, fs.constants.R_OK);
    if (stats.isDirectory()) {
      throw new Error("Directory, not a file");
    }
    const stream = fs.createReadStream(filePath);
    let streamError = false;

    stream.on("error", (err) => {
      streamError = true;
      logger(req.method, req.url, 500);
      myError(`STREAM ERROR---${err.message}`, 500, res);
    });
    stream.on("open", () => {
      res.writeHead(200, {
        "Content-Length": stats.size,
        "Content-Type": getContentType(filePath),
      });
    });
    res.on("finish", function () {
      if (!streamError) {
        logger(req.method, req.url, 200);
      } else streamError = false;
    });

    stream.pipe(res);
  } catch (err) {
    //console.log(err.message);
    if (err.message === "Wrong method") {
      logger(req.method, req.url, 405);
      myError(`Only GET method is allowed---${err.message}`, 405, res);
    } else if (err.message === "Directory, not a file") {
      logger(req.method, req.url, 404);
      myError(`${err.message}`, 404, res);
    } else if (
      err.message === `ENOENT: no such file or directory, lstat '${err.path}'`
    ) {
      logger(req.method, req.url, 404);
      myError(`Requested resource is not available---${err.message}`, 404, res);
    } else if (err.code === "EPERM") {
      logger(req.method, req.url, 401);
      myError(`Access denied---${err.message}`, 401, res);
    } else {
      logger(req.method, req.url, 500);
      myError(`Internal Server Error---${err.message}`, 500, res);
    }
  }
});

server.listen(3000, () => {
  console.log("server started at port 3000");
});
