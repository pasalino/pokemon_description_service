import express from 'express';
import routes from './routes'
import logger from "./helpers/logger";

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', routes);

app.listen(port, () => {
    logger.info(`App listening at ${port}`)
})

export default app;
