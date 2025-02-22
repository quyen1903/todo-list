// src/test/fixtures/taskFixture.ts
import { TaskDto } from "../../src/types/task";

export const createTaskFixture = (overrides?: Partial<TaskDto>): TaskDto => ({
    name: 'Default Task Name',
    startDate: '2024-01-01',
    endDate: '2024-01-10',
    ...overrides
});

// src/test/utils/testDb.ts
import { DataSource } from 'typeorm';
import { Task } from '../../src/entity/Task';

export const createTestDatabase = async (): Promise<DataSource> => {
    const testDataSource = new DataSource({
        type: 'sqlite',
        database: ':memory:',
        entities: [Task],
        synchronize: true,
        logging: false
    });

    await testDataSource.initialize();
    return testDataSource;
};

export const clearDatabase = async (dataSource: DataSource): Promise<void> => {
    const entities = dataSource.entityMetadatas;
    for (const entity of entities) {
        const repository = dataSource.getRepository(entity.name);
        await repository.clear();
    }
};