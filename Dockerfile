FROM node:22-alpine
WORKDIR /src
COPY package.json ./
RUN npm install
COPY . ./
CMD npm start