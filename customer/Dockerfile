FROM node:carbon-alpine

# create work directory
WORKDIR /usr/src/app

# copy package.json
COPY package.json ./
RUN npm install

# copy source code
COPY . .

EXPOSE 10000

CMD ["npm", "start"]
