FROM node:8.12.0

WORKDIR /dodo-frontend

COPY ./package.json .
RUN yarn install

COPY . .
ENTRYPOINT yarn start
