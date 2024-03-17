export const mongoConfig = {
  serverUrl: process.env.DATABASE_URL || "mongodb://0.0.0.0/localhost:27017",
  database: "CoverAI",
};
