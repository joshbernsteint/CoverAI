import userRoutes from "./users/users.controller.js";
import resumeRoutes from "./resumes/resumes.controller.js";
import coverRoutes from "./covers/covers.controller.js";
import clerkWebHook from "./webhooks/clerk.js";

const routes = (app) => {
  app.use("/api/users", userRoutes);
  app.use("/api/covers", coverRoutes);
  app.use("/api/resumes", resumeRoutes);
  app.use("/api/webhooks", clerkWebHook);
};

export default routes;
