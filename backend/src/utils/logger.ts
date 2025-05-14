const getTimestamp = (): string => new Date().toISOString();

export const info = (...params: any[]): void => {
    console.log(`[INFO] ${getTimestamp()}:`, ...params);
};

export const error = (...params: any[]): void => {
    console.error(`[ERROR] ${getTimestamp()}:`, ...params);
};

export const warn = (...params: any[]): void => {
    console.warn(`[WARN] ${getTimestamp()}:`, ...params);
};

export const debug = (...params: any[]): void => {
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