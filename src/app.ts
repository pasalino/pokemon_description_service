import express from 'express';
import routes from './routes'
import logger from "./helpers/logger";
import {StatusCodes} from "http-status-codes";

if (!process.env.FUN_TRANSLATION_KEY) {
    logger.warn('Translate API Key not provided');
}

logger.info(`Pokemon game's version: ${process.env.POKEMON_GAME_VERSION}`);

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', routes);

app.get('*', (req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({error: 'End-point not found'});
});

app.listen(port, () => {
    logger.info(`App listening at ${port}`)
})

export default app;
