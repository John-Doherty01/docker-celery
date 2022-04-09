FROM node:17.5-alpine
ARG REACT_ENV_PROD
EXPOSE 3000

WORKDIR /usr/src/app
ENV PATH /usr/src/app/hitman-webapp/node_modules/.bin:$PATH
COPY ./ ./
WORKDIR /usr/src/app/hitman-webapp/
RUN npm install
RUN touch .env
RUN echo "$REACT_ENV_PROD" > .env
RUN npm run build

CMD ["node", "index.ts"]