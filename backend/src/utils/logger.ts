const getTimestamp = (): string => new Date().toISOString();

export const info = (...params: unknown[]): void => {
    console.log(`[INFO] ${getTimestamp()}:`, ...params);
};

export const error = (...params: unknown[]): void => {
    console.error(`[ERROR] ${getTimestamp()}:`, ...params);
};

export const warn = (...params: unknown[]): void => {
    console.warn(`[WARN] ${getTimestamp()}:`, ...params);
};

export const debug = (...params: unknown[]): void => {
    if (process.env.NODE_ENV === 'development') {
        console.debug(`[DEBUG] ${getTimestamp()}:`, ...params);
    }
};

export default {
    info,
    error,
    warn,
    debug,
};