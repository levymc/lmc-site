const path = require("path");
const dotenv = require("dotenv");

const envFiles = [".env.local", ".env"];
envFiles.forEach((file) => {
  const fullPath = path.resolve(process.cwd(), file);
  dotenv.config({ path: fullPath, override: true });
});

const baseConfig = {
  dialect: "postgres",
  host: process.env.DATABASE_HOST ?? "localhost",
  port: Number(process.env.DATABASE_PORT ?? 5432),
  database: process.env.DATABASE_NAME ?? "lmc",
  username: process.env.DATABASE_USER ?? "lmc",
  password: process.env.DATABASE_PASSWORD ?? "lmc",
  logging: false,
  define: {
    underscored: true,
    freezeTableName: false
  }
};

const url = process.env.DATABASE_URL;

const configWithUrl = url
  ? {
      use_env_variable: "DATABASE_URL",
      dialect: "postgres",
      dialectOptions: {
        ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false
      }
    }
  : undefined;

module.exports = {
  development: configWithUrl ?? baseConfig,
  production: configWithUrl ?? baseConfig,
  test: configWithUrl ?? {
    ...baseConfig,
    database: process.env.DATABASE_NAME ?? "lmc_test"
  }
};
