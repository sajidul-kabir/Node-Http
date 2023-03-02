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
    await fs.promises.access(filePath);

    const stream = fs.createReadStream(filePath);
    const stats = await fs.promises.stat(filePath, fs.constants.R_OK);
    let streamError = false;

    stream.on("error", (err) => {
      streamError = true;
      if (err.code === "EISDIR") {
        logger(req.method, req.url, 404);
        myError(`Directory, not a file---${err.message}`, 404, res);
      } else if (err.code === "EACCES") {
        logger(req.method, req.url, 401);
        myError(`Permission Denied---${err.message}`, 401, res);
      }
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
      //console.log('The pipe operation has been completed fully.');
    });

    stream.pipe(res);
  } catch (err) {
    if (err.message === "Wrong method") {
      logger(req.method, req.url, 405);
      myError(`Only GET method is allowed---${err.message}`, 405, res);
    } else if (
      err.message === `ENOENT: no such file or directory, access '${err.path}'`
    ) {
      logger(req.method, req.url, 404);
      myError(`Requested resource is not available---${err.message}`, 404, res);
    } else {
      logger(req.method, req.url, 500);
      myError(`Internal Server Error---${err.message}`, 500, res);
    }
  }
});

server.listen(3000, () => {
  console.log("server started at port 3000");
});
