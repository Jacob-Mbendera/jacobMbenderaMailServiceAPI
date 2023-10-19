import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({
      level: 'info',
      filename: 'logs/success.log',
    }),
    new transports.File({
      level: 'warn',
      filename: 'logs/warnings.log',
    }),
    new transports.File({
      level: 'error',
      filename: 'logs/errors.log',
    }),
  ],
  format: format.combine(
    format.json(),
    format.timestamp(),
    format.metadata(),
    format.prettyPrint()
  ),
});
