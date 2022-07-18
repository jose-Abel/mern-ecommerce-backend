FROM node

WORKDIR /app

COPY package.json	/app

RUN npm install

COPY . /app

EXPOSE 8000

ENV MONGODB_URL=mongodb

CMD ["npm", "start"]