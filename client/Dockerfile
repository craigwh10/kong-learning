FROM node:carbon-alpine

# create work directory
WORKDIR /usr/src/app

# copy package.json
COPY package.json ./
RUN yarn


COPY . .

# build files

RUN yarn build


EXPOSE 10001

CMD ["yarn", "start"]
