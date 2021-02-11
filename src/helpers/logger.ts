import {createLogger, format, transports} from "winston";

const LABEL = 'pokemon_descriptions';

const myFormat = format.printf(({level, message, label, timestamp}) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});


const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: format.combine(
        format.label({label: LABEL}),
        format.timestamp(),
        myFormat
    )
});

if (process.env.LOG_IN_FILE === 'true') {
    logger.add(new transports.File({
        filename: 'log/pokemon_descriptions.log',
    }));
}

logger.add(new transports.Console({
    format: format.combine(
        format.colorize(),
        format.label({label: LABEL}),
        format.timestamp(),
        myFormat
    )
}));

export default logger;
