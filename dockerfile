FROM node:24-alpine

WORKDIR /back

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3001

CMD ["npm", "run","dev"]