import express from 'express';
import routes from './routes'
import logger from "./helpers/logger";

if (!process.env.FUN_TRANSLATION_KEY) {
    logger.warn('Translate API Key not provided');
}

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', routes);

app.listen(port, () => {
    logger.info(`App listening at ${port}`)
})

export default app;
