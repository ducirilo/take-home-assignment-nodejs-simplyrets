import { DataSource } from 'typeorm';
import { Property } from './entities';

const isTestEnv = process.env.NODE_ENV === 'test';

const AppDataSource = new DataSource({
    logging: false,
    type: 'sqlite',
    database:  isTestEnv ? ':memory:' : 'property.db', // let's keep the database used by test in memory only
    entities: [Property],
    synchronize: true, // synchronize the database schema with the entity classes
});

export default AppDataSource;

export const seedDb = async () => {
    const propertyRecordsCount = await AppDataSource.manager.count(Property);

    if (propertyRecordsCount > 0) {
        console.info('Database is already seeded!');
        return;
    }

    const { default: data } = await import('./data/seed.json');

    await AppDataSource.manager.insert(Property, data);
};
