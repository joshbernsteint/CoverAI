import userRoutes from "./users/users.controller.js";

const routes = (app) => {
  app.use("/users", userRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

export default routes;
