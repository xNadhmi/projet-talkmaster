import mysql, { RowDataPacket, FieldPacket, QueryResult } from 'mysql2/promise';
import { DATABASE_URL, NODE_ENV } from './index';
import logger from '../utils/logger';


let pool: mysql.Pool | null = null;

export const connectDB = async (): Promise<void> => {
    try {
        if (!DATABASE_URL) {
            throw new Error('DATABASE_URL is not defined in the environment variables.');
        }
        pool = mysql.createPool(DATABASE_URL);

        const connection = await pool.getConnection();
        logger.info('Successfully connected to the MySQL database!');
        
        const [rows] = await connection.query('SELECT 1 + 1 AS solution');
        if (Array.isArray(rows) && rows.length > 0 && typeof rows[0] === 'object' && rows[0] !== null && 'solution' in rows[0]) {
            const solutionRow = rows[0] as { solution: number };
            logger.info(`MySQL query test successful: 1 + 1 = ${solutionRow.solution}`);
        } else {
            logger.warn('MySQL query test returned an unexpected format:', rows);
        }
        connection.release();
    } catch (err: any) {
        logger.error('Failed to connect to the MySQL database:', err.stack || err);
        pool = null;
        if (NODE_ENV !== 'test') {
            process.exit(1);
        }
        throw err;
    }
};

export const query = async <T extends QueryResult = RowDataPacket[]>(
    sql: string,
    params?: any[]
): Promise<[T, FieldPacket[]]> => {
    if (!pool) {
        logger.error('MySQL connection pool is not initialized. Ensure connectDB has been called successfully.');
        throw new Error('MySQL connection pool is not initialized.');
    }
    const start = Date.now();
    const result = await pool.execute<T>(sql, params);
    const duration = Date.now() - start;
    logger.debug(`Executed MySQL query: ${sql.substring(0, 100)}...`, { duration });
    return result;
};

export default connectDB;
