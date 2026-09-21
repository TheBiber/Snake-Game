import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "biber_retro", // שינוי לשם פשוט בלי רווחים
  synchronize: true,
  logging: false,
  entities: [__dirname + "/entity/**/*.ts"],
  migrations: [],
  subscribers: [],
});
