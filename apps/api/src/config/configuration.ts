const configuration = () => ({
  app: {
    nodeEnv: process.env.NODE_ENV ?? "development",
    port: Number(process.env.PORT ?? 3001)
  },
  database: {
    host: process.env.DATABASE_HOST ?? "localhost",
    port: Number(process.env.DATABASE_PORT ?? 5432),
    name: process.env.DATABASE_NAME ?? "lmc",
    user: process.env.DATABASE_USER ?? "lmc",
    password: process.env.DATABASE_PASSWORD ?? "lmc",
    url: process.env.DATABASE_URL
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET ?? "change-me"
  }
});

export default configuration;
