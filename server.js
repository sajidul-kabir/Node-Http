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
    const stats = await fs.promises.stat(filePath);

    stream.on("error", (err) => {
      console.error(err);
      res.status(500).send("Internal server error");
    });

    res.writeHead(200, {
      "Content-Length": stats.size,
      "Content-Type": getContentType(filePath),
    });

    stream.pipe(res);
    logger(req.url, 200);
  } catch (err) {
    console.log(err.message);

    if (err.message === "Wrong method") {
      res.writeHead(405, {
        "Content-type": "text/html",
      });
      logger(req.url, 405);
      res.end(`<h1>${err.message}!</h1>`);
    } else {
      res.writeHead(404, {
        "Content-type": "text/html",
      });
      logger(req.url, 404);
      res.end(`<h1>${err.message}!</h1>`);
    }
  }
});

server.listen(3000, () => {
  console.log("server started at port 3000");
});
