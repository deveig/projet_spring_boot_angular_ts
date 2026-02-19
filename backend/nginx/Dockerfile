FROM nginx:latest
WORKDIR /
# RUN openssl req -x509 -newkey rsa:4096 -keyout /etc/ssl/private/nginx.key -out /etc/ssl/certs/nginx.crt -days 365 -nodes -subj "/C=FR/ST=France/L=Paris/O=MyCompany/OU=Dev/CN=nginx-back"
COPY nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]