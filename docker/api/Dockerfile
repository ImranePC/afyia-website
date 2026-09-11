FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY ./api /app/api
RUN chmod +X /app/api/entrypoint.sh

EXPOSE 3001

ENTRYPOINT ["/bin/sh", "/app/api/entrypoint.sh"]
