#FROM node:16-alpine AS build
#
#WORKDIR /app
#
#COPY package.json .
#COPY package-lock.json .
#RUN npm install
#COPY . .

FROM node:16-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY ./ ./

RUN npm i

CMD ["npm", "run", "build"]