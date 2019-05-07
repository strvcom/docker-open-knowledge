# ---- Base Node ----
FROM node:dubnium AS base
# Create app directory
WORKDIR /app

# ---- Dependencies ----
FROM base AS dependencies  
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# WORKDIR /app
COPY ./package*.json ./
# install app dependencies including 'devDependencies'
RUN npm install

# ---- Copy Files/Build ----
FROM dependencies AS build  
# WORKDIR /app
# source code
COPY ./src /app/src/
# tests
COPY ./tests /app/tests/
# linter
COPY ./.eslintrc.js /app

# --- Release with Alpine ----
FROM node:10-alpine AS release  
# Create app directory
WORKDIR /app
# Change file owner of /app to non root user defined in base image
RUN chown -R node:node /app
RUN chmod 755 /app
# Switch to non root user defined in base image
USER node
COPY --from=dependencies /app/package.json ./
# Install app dependencies
RUN npm install --only=production
COPY --from=build /app ./
CMD ["node", "src/app.js"]