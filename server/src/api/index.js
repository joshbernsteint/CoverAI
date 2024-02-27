import userRoutes from "./users/users.controller.js";
import resumeRoutes from "./resumes/resumes.controller.js";
import coverRoutes from "./covers/covers.controller.js";

const routes = (app) => {
  app.use("/users", userRoutes);
  app.use("/covers", coverRoutes);
  app.use("/resumes", resumeRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

export default routes;
