import mysql, { RowDataPacket, FieldPacket, QueryResult, Pool, PoolOptions } from 'mysql2/promise';
import { DATABASE_URL, NODE_ENV } from './index.js';
import logger from '../utils/logger.js';
import { ApiError } from '../utils/ApiError.js';

let pool: Pool | null = null;

interface SolutionRow {
    solution: number;
}

export const getPool = (): Pool => {
    if (!pool) {
        logger.error('MySQL connection pool is not initialized. Ensure connectDB has been called successfully.');
        throw new ApiError(500, 'Database pool not initialized. Cannot perform database operations.');
    }
    return pool;
};

export const connectDB = async (): Promise<void> => {
    try {
        if (!DATABASE_URL) {
            logger.error('DATABASE_URL is not defined in the environment variables.');
            throw new Error('DATABASE_URL is not defined. Database connection cannot be established.');
        }

        const poolOptions: PoolOptions | string = DATABASE_URL;
        pool = mysql.createPool(poolOptions);

        const connection = await pool.getConnection();
        logger.info('Successfully connected to the MySQL database!');
        
        const [rows] = await connection.query<RowDataPacket[]>('SELECT 1 + 1 AS solution');
        
        if (rows.length > 0) {
            const solutionRow = rows[0] as SolutionRow; 
            if (typeof solutionRow.solution === 'number') {
                logger.info(`MySQL query test successful: 1 + 1 = ${solutionRow.solution}`);
            } else {
                logger.warn('MySQL query test returned a row, but "solution" field is not a number or is missing:', solutionRow);
            }
        } else {
            logger.warn('MySQL query test returned no rows.');
        }
        connection.release();
    } catch (err: unknown) {
        let errorMessage = 'Failed to connect to the MySQL database';
        let errorStack: string | undefined;

        if (err instanceof Error) {
            errorMessage = `${errorMessage}: ${err.message}`;
            errorStack = err.stack;
        } else if (typeof err === 'string') {
            errorMessage = `${errorMessage}: ${err}`;
        } else if (typeof err === 'object' && err !== null && 'message' in err) {
            errorMessage = `${errorMessage}: ${(err as { message: string }).message}`;
        }
        
        logger.error(errorMessage, { stack: errorStack });
        
        if (pool) {
            await pool.end().catch(closeErr => {
                let closeErrorMessage = 'Failed to close the MySQL pool during error handling';
                if (closeErr instanceof Error) {
                    closeErrorMessage = `${closeErrorMessage}: ${closeErr.message}`;
                }
                logger.error(closeErrorMessage, { stack: (closeErr instanceof Error ? closeErr.stack : undefined) });
            });
            pool = null;
        }

        if (NODE_ENV !== 'test') {
            process.exit(1);
        }
        throw err; 
    }
};

export const query = async <T extends QueryResult = RowDataPacket[]>(
    sql: string,
    params?: unknown[]
): Promise<[T, FieldPacket[]]> => {
    const currentPool = getPool();
    const start = Date.now();
    try {
        const result = await currentPool.execute<T>(sql, params);
        const duration = Date.now() - start;
        logger.debug(`Executed MySQL query: ${sql.substring(0, 100)}...`, { duration, paramsCount: params?.length || 0 });
        return result;
    } catch (error: unknown) {
        let queryErrorMessage = `Failed to execute MySQL query: ${sql.substring(0,100)}...`;
        if (error instanceof Error) {
            queryErrorMessage = `${queryErrorMessage} - Error: ${error.message}`;
        }
        logger.error(queryErrorMessage, { params, stack: (error instanceof Error ? error.stack : undefined) });
        throw new ApiError(500, 'Database query failed.', [{ message: queryErrorMessage }]);
    }
};

export default connectDB;