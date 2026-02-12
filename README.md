# Cooking recipe web page

Development of a cooking recipe web page.

## Project

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2, TypeScript 5.1.6, Node v18.17.1 and npm 9.8.1 for front-end of the application. For the back-end, it was generated with [Spring Boot](https://github.com/spring-projects/spring-boot) version 3.1.3, Java 17, [Maven](https://maven.apache.org/install.html) version 3.9.4, [BellSoft Liberica JDK](https://spring.io/quickstart), version 17. And using phpMyAdmin of [MAMP](https://www.mamp.info/en/downloads/) for database.

## Database with phpMyAdmin of MAMP

Settings of the database are in "application.properties" file. In accordance with default values 'user', 'password', 'port' of MySQL Server with MAMP.
Create a database named 'recipe' in phpMyAdmin.

## Run application

Start MySQL server with MAMP.
Run `mvn spring-boot:run`.
Open browser and search for `http://localhost:8080`.

## Run tests

### Front-end tests

Uncomment 'npm test' execution in 'pom.xml' file.
Install Chrome.
Run `mvn test`.

### Back-end tests

Start MySQL server with MAMP.
Run `mvn test`.

## GitHub Actions with tests and Docker