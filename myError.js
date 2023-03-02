//Custom Error Class
exports.myError = (msg, status, res) => {
  console.log(msg);
  res.writeHead(status, {
    "Content-type": "text/html",
  });
  res.end(`<h1>${msg}!</h1>`);
};
