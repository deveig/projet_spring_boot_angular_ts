FROM maven:4.0.0-rc-5-ibm-semeru-25-noble AS build-stage
COPY . /app
WORKDIR /app
RUN mvn -B package --file pom.xml -DskipTests

# FROM ibm-semeru-runtimes:open-17-jdk AS production-stage
# RUN mkdir /opt/app
# COPY --from=build-stage /app/target/recipe-0.0.1-SNAPSHOT.jar /opt/app
# CMD ["java", "-jar", "/opt/app/recipe-0.0.1-SNAPSHOT.jar"]