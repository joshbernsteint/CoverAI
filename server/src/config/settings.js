export const mongoConfig = {
  serverUrl: process.env.DATABASE_URL || "mongodb://localhost:27017",
  database: "CoverAI",
};
