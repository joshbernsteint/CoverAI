import app from "./app.js";

app.listen(80, function () {
  console.log(`🚀 Server running on ${process.env.SERVER_URL}`);
});
