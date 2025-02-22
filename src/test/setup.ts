import { DataSource } from "typeorm";
import { Task } from "../entity/Task";

export const testDataSource = new DataSource({
  type: "sqlite",
  database: ":memory:",
  entities: [__dirname + '/../entity/*.ts'],
  synchronize: true
});

beforeAll(async () => {
  await testDataSource.initialize();
});

afterAll(async () => {
  await testDataSource.destroy();
});
