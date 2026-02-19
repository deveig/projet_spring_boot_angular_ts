FROM node:latest 
WORKDIR /usr/local/app
COPY package*.json .
RUN npm install
COPY . .
# RUN openssl req -x509 -newkey rsa:4096 -keyout /etc/ssl/private/app.key -out /etc/ssl/certs/app.crt -days 365 -nodes -subj "/C=FR/ST=France/L=Paris/O=MyCompany/OU=Dev/CN=front"
# RUN export NODE_EXTRA_CA_CERTS=/etc/ssl/certs/app.crt
# RUN export NODE_USE_SYSTEM_CA=1
RUN npm run build
CMD ["npm", "run", "serve:ssr:my-app"]