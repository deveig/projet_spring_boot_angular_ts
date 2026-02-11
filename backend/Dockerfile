FROM ibm-semeru-runtimes:open-17-jdk
RUN mkdir /opt/app
COPY jar/recipe-0.0.1-SNAPSHOT.jar /opt/app
CMD ["java", "-jar", "/opt/app/recipe-0.0.1-SNAPSHOT.jar"]