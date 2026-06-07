FROM node:lts-trixie

WORKDIR /app

COPY package*.json ./

RUN npm i
RUN npm i -g ts-node typescript

COPY . .

# this depends on the port you set in your .env of course
EXPOSE 3069

CMD ["ts-node", "index.ts"]