FROM node:20.1 AS base

WORKDIR /app
RUN npm i prisma@5.4.2

COPY ./prisma/ .

ENTRYPOINT [ "npx", "--no-install", "prisma", "migrate", "deploy"]
