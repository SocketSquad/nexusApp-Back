import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> => {
      try {
        const connection = await mongoose.connect(process.env.DATABASE_URL);
        console.log('Database connected successfully');
        return connection;
      } catch (error) {
        console.error('Database connection error:', error);
        throw error;
      }
    },
  },
];
