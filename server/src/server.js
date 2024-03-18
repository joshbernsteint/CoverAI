import app from "./app";

app.listen(3000, function () {
  console.log(`🚀 Server running on ${process.env.SERVER_URL}`);
});
