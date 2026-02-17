FROM maven:4.0.0-rc-5-ibm-semeru-25-noble AS build-stage
ARG DB_URL
ARG DB_USERNAME
ARG DB_PASSWORD
ENV DB_URL=$DB_URL
ENV DB_USERNAME=$DB_USERNAME
ENV DB_PASSWORD=$DB_PASSWORD
COPY . /app
WORKDIR /app
RUN echo "spring.datasource.url=$DB_URL" > src/main/resources/application.properties
RUN echo "spring.datasource.username=$DB_USERNAME" >> src/main/resources/application.properties
RUN echo "spring.datasource.password=$DB_PASSWORD" >> src/main/resources/application.properties
RUN echo "spring.jpa.hibernate.ddl-auto=update" >> src/main/resources/application.properties
RUN echo "spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver" >> src/main/resources/application.properties
RUN echo "spring.data.rest.base-path=/recipe" >> src/main/resources/application.properties
RUN echo "server.port=8443" >> src/main/resources/application.properties
RUN echo "server.ssl.certificate=classpath:my-cert.crt" >> src/main/resources/application.properties
RUN echo "server.ssl.certificate-private-key=classpath:my-cert.key" >> src/main/resources/application.properties
#RUN echo "server.ssl.trust-certificate=classpath:ca-cert.crt" >> src/main/resources/application.properties
RUN openssl req -x509 -newkey rsa:4096 -keyout /app/src/main/resources/my-cert.key -out /app/src/main/resources/my-cert.crt -days 365 -nodes -subj "/CN=localhost"
RUN mvn -B package --file pom.xml -DskipTests

FROM ibm-semeru-runtimes:open-17-jdk AS production-stage
RUN mkdir /opt/app
COPY --from=build-stage /app/target/recipe-0.0.1-SNAPSHOT.jar /opt/app
# CMD ["java", "-jar", "/opt/app/recipe-0.0.1-SNAPSHOT.jar"]