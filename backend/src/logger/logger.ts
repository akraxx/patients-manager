import winston from 'winston';

const { combine, splat, printf, timestamp, colorize } = winston.format;

export const customFormat = printf(info => {
    return `${info.timestamp}: ${info.level} - ${info.message}`
})

export const logger = winston.createLogger({
    level: 'debug',
    format: combine(
        splat(),
        colorize(),
        timestamp(),
        customFormat,
    ),
    defaultMeta: { service: 'patient-manager-backend' },
    transports: [
        new winston.transports.Console()
    ],
});