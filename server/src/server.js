import app from "./app.js";

app.listen(3000, function () {
  console.log(`🚀 Server running on ${process.env.SERVER_URL}`);
});
