import userRoutes from "./users/users.controller.js";
import resumeRoutes from "./resumes/resumes.controller.js";
import coverRoutes from "./covers/covers.controller.js";
import clerkWebHook from "./webhooks/clerk.js";

const routes = (app) => {
  app.use("/users", userRoutes);
  app.use("/covers", coverRoutes);
  app.use("/resumes", resumeRoutes);
  app.use("/webhooks", clerkWebHook);
};

export default routes;
