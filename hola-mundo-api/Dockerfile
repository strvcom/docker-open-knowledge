# ---- Base Node ----
FROM node:dubnium AS base
# USER node
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
COPY --from=dependencies /app/package.json ./
# Install app dependencies
RUN npm install --only=production
COPY --from=build /app ./
CMD ["node", "src/app.js"]