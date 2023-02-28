const http = require("http");
const fs = require("fs");
const { logger } = require("./logger");
const { getContentType } = require("./contentType");

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
      console.error(err);
      res.writeHead(404).end(`<h1>${err.message}!</h1>`);
      logger(req.method, req.url, 404);
      streamError = true;
    });

    res.writeHead(200, {
      "Content-Length": stats.size,
      "Content-Type": getContentType(filePath),
    });

    stream.pipe(res);
    res.on("finish", function () {
      if (!streamError) {
        logger(req.method, req.url, 200);
      } else streamError = false;
      //console.log('The pipe operation has been completed fully.');
    });
  } catch (err) {
    console.log(err.message);

    if (err.message === "Wrong method") {
      res.writeHead(405, {
        "Content-type": "text/html",
      });
      logger(req.method, req.url, 405);
      res.end(`<h1>${err.message}!</h1>`);
    } else {
      res.writeHead(404, {
        "Content-type": "text/html",
      });
      logger(req.method, req.url, 404);
      res.end(`<h1>${err.message}!</h1>`);
    }
  }
});

server.listen(3000, () => {
  console.log("server started at port 3000");
});
