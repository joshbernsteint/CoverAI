import * as service from "./src/api/resumes/resumes.service.js";

async function main() {
  await service.createResumeFromPDF("resume", "id");
}

main();
