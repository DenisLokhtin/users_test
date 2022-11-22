FROM node:18.0.0-alpine
RUN npm i -g npm@9.1.2
RUN npm --version
RUN mkdir -p /src/app/
COPY ./package.json ./package-lock.json /src/app/
WORKDIR /src/app/
RUN npm install
COPY ./ /src/app

CMD ["npm", "start"]