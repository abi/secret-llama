
FROM node:lts

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

EXPOSE 4173

CMD ["yarn", "build-and-preview", "--host"]
