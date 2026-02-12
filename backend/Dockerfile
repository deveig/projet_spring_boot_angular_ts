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
RUN mvn -B package --file pom.xml -DskipTests

FROM ibm-semeru-runtimes:open-17-jdk AS production-stage
RUN mkdir /opt/app
COPY --from=build-stage /app/target/recipe-0.0.1-SNAPSHOT.jar /opt/app
# CMD ["java", "-jar", "/opt/app/recipe-0.0.1-SNAPSHOT.jar"]