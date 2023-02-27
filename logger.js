const fs = require("fs");
exports.logger = async (pathname, statusCode) => {
  try {
    await fs.promises.appendFile(
      "logs.txt",
      ` 
            Request sent to ${pathname} --- Response ${statusCode} at ${new Date().toLocaleString(
        "en-GB",
        { timeZone: "Asia/Dhaka" }
      )}
            `
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
};
