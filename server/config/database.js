import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const dialect = process.env.DB_DIALECT || 'sqlite';

let sequelize;

if (dialect === 'mysql') {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'shikhar360_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
} else {
  // SQLite - zero external dependencies, robust and instant
  const serverDbPath = path.resolve(__dirname, '../shikhar360.sqlite');
  let dbPath = serverDbPath;

  if (process.env.DB_STORAGE) {
    if (path.isAbsolute(process.env.DB_STORAGE)) {
      dbPath = process.env.DB_STORAGE;
    } else {
      const fromCwd = path.resolve(process.cwd(), process.env.DB_STORAGE);
      const fromDir = path.resolve(__dirname, '..', process.env.DB_STORAGE);
      dbPath = fs.existsSync(fromCwd) ? fromCwd : (fs.existsSync(fromDir) ? fromDir : serverDbPath);
    }
  }

  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false,
  });
}

export default sequelize;
