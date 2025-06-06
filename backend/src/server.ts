import app from './app.js';
import { connectDB, PORT, NODE_ENV } from './config/index.js';
import logger from './utils/logger.js';

const startServer = async () => {
   try {
      await connectDB();

      app.listen(PORT, () => {
         logger.info(`Backend server started on port ${PORT}`);
         logger.info(`Environment: ${NODE_ENV}`);
         console.log(`[INFO] Server running at http://localhost:${PORT}`);
      });
   } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
   }
};

const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
signals.forEach(signal => {
   process.on(signal, () => {
      logger.info(`Signal ${signal} received. Shutting down server...`);
      setTimeout(() => process.exit(0), 500);
   });
});

process.on('unhandledRejection', (reason, promise) => {
   logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
   logger.error('Uncaught Exception:', error);
   process.exit(1);
});


startServer();

