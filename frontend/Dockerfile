FROM node:latest 
WORKDIR /usr/local/app
COPY package*.json .
RUN npm install
COPY . .
RUN openssl req -x509 -newkey rsa:4096 -keyout /etc/ssl/private/app.key -out /etc/ssl/certs/app.crt -days 365 -nodes -subj "/CN=localhost"
RUN npm run build
CMD ["npm", "run", "serve:ssr:my-app"]