FROM node:12-slim AS base
ENV NODE_ENV=production
WORKDIR /app
RUN chown -R node:node /app
RUN chmod 755 /app
USER node
COPY ./package*.json ./
RUN npm ci && npm cache clean --force

FROM base AS dev
ENV NODE_ENV=development
ENV PATH /app/node_modules/.bin:${PATH}
RUN npm install --only=development
CMD ["nodemon", "src/app.js", "--inspect=0.0.0.0:9229"]

FROM base AS source
COPY ./src /app/src/

FROM source as test
ENV NODE_ENV=development
ENV PATH /app/node_modules/.bin:${PATH}
COPY --from=dev /app/node_modules /app/node_modules
COPY ./.eslintrc.js /app/.eslintrc.js
COPY ./tests/ /app/tests/
RUN eslint .
RUN jest
CMD ["echo", "tests succeed!"]

FROM source AS prod
CMD ["node", "src/app.js"]
