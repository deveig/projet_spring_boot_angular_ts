FROM node:latest 
WORKDIR /usr/local/app
COPY package*.json .
RUN npm install
COPY . .
CMD ["npm", "run", "build"]