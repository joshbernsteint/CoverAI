import app from "./app.js";
import fs from 'fs';
import https from 'https';


const inDevelopmentMode = process.env.IN_DEV === "true" || false;

if(inDevelopmentMode){
  app.listen(process.env.PORT , function () {
    console.log(`🚀 Server running on ${process.env.SERVER_URL}`);
  });
}
else{
  const httpsOptions = inDevelopmentMode ? {} : {
    pfx: fs.readFileSync(process.env.CERT_PATH),
    passphrase: "",
  };
  const httpsServer =  https.createServer(httpsOptions, app);
  httpsServer.listen((process.env.PORT || 3000), () => {
    console.log(`🚀 Server running on ${process.env.SERVER_URL}`);
  });
}
