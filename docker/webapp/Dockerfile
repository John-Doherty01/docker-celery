FROM node:17.5-alpine as build-stage
ARG REACT_ENV_PROD
WORKDIR /usr/src/app
ENV PATH /usr/src/app/hitman-webapp/node_modules/.bin:$PATH
COPY ./ ./
WORKDIR /usr/src/app/hitman-webapp/
RUN npm install
ENV REACT_ENV_PROD $REACT_ENV_PROD
RUN cat $REACT_ENV_PROD > .env.production.local
RUN npm run build

FROM nginx:1.15
COPY --from=build-stage /usr/src/app/hitman-webapp/build/ /usr/share/nginx/html
COPY --from=build-stage /usr/src/app/docker/webapp/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]