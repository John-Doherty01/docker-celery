FROM node:17.5-alpine
ARG REACT_ENV_PROD
EXPOSE 3000

WORKDIR /usr/src/app
ENV PATH /usr/src/app/hitman-webapp/node_modules/.bin:$PATH
COPY ./ ./
WORKDIR /usr/src/app/hitman-webapp/
RUN npm install
RUN npm install serve -g
RUN cat $REACT_ENV_PROD > .env.production.local
RUN npm run build

CMD ["serve", "-s", "build", "-p", "3000"]