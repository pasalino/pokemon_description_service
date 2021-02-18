FROM node:12

RUN mkdir app
WORKDIR /app

ENV NODE_ENV production

COPY package*.json ./
COPY .env.docker .env.production

RUN npm install --production

COPY ./dist ./

CMD ["node", "-r", "dotenv-flow/config", "app.js"]
