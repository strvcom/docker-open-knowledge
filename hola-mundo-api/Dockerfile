FROM node:10-alpine as base

ENV NODE_ENV=production
ENV HOME=/home/node
ENV APP_DIR=${HOME}/app
EXPOSE 3000
RUN mkdir ${APP_DIR} && chown -R node:node ${APP_DIR}
WORKDIR ${APP_DIR}
USER node
COPY --chown=node:node package*.json ./
RUN npm ci && npm cache clean --force

# TODO: Next session
FROM base as dev

CMD ["echo", "lol I do nothing, yet... :)"]

FROM base as source

COPY --chown=node:node . .

# Intended to be called on a CI env
FROM source as test

ENV NODE_ENV=development
ENV PATH ${APP_DIR}/node_modules/.bin:${PATH}
RUN npm install --only=development
COPY --from=dev ${APP_DIR}/node_modules ${APP_DIR}/node_modules
RUN eslint .
RUN jest
CMD ["echo", "tests succeed!"]

FROM source as prod
CMD ["node", "src/app.js"]
