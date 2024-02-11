import * as service from "./src/api/resumes/resumes.service.js";

async function main() {
  console.log("Creating resume from PDF");
  await service.createResumeFromPDF(
    "../../public/examples/JoshuaGorman_Resume2024a.pdf",
    "id"
  );
}

main();
