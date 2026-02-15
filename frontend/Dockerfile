FROM node:latest 
WORKDIR /usr/local/app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "serve:ssr:my-app"]