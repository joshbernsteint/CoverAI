# How to Run

1. Install dependencies (if they are not already) with:
   ```
   npm install
   ```
2. Once the dependencies are installe, build the application with static HTML and Js with:
   ```
   npm run build
   ```
3. Open a chromium-based browser (basically anything other than Firefox), and go to the following URL: 
   ```
   <BROSER NAME>://extensions/
   ```
   Here is a guide for what to replace `<BROWSER NAME>` with depending on the active browser:
   |   Browser    |     URL |
   | :---:        | :---:   |
   | Google Chrome       | [chrome://extensions/](chrome://extensions/)
   | Microsoft Edge       | [edge://extensions/](edge://extensions/)
4. On the browser page, click "Load unpacked", and navigate to the `build/` directory and select it.
5. This should set the extension running on your browser in development. Any changes made to the build folder should automatically update the extension. If not, you can click the "Reload" button located on the extensions page.