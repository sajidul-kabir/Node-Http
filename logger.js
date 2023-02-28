const fs = require("fs");
exports.logger = async (method, pathname, statusCode) => {
  try {
    await fs.promises.appendFile(
      "logs.txt",
      ` 
          ${method} Request sent to ${pathname} --- Response ${statusCode} at ${new Date().toLocaleString(
        "en-GB",
        { timeZone: "Asia/Dhaka" }
      )}
            `
    );
  } catch (err) {
    console.error(err);
  }
};
