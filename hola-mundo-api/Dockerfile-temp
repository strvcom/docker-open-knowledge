# ---- Base Node ----
FROM node:12-slim AS base
# Create app directory
WORKDIR /app
RUN chown -R node:node /app
RUN chmod 755 /app
# Switch to non root user defined in base image
USER node
COPY ./package*.json ./
# Install app dependencies
RUN npm install --only=production

FROM base AS dev
RUN npm install --only=development

FROM base AS source
COPY ./src /app/src/

FROM source AS prod
CMD ["node", "src/app.js"]