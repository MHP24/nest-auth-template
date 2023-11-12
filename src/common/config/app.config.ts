export const appConfig = () => ({
  port: Number(process.env.PORT ?? 5001),
  database: {
    name: process.env.DB_NAME,
    port: +process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    url: process.env.DB_URL,
  },
  jwtSecret: process.env.JWT_SECRET,
});
