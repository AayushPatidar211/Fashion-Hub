# Stage 1: Build the Java Spring Boot Application with Maven
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create lightweight production runtime image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

COPY --from=build /app/target/stylecart-backend-1.0.0.jar app.jar

ENV SERVER_PORT=8080
ENV MYSQL_HOST=mysql
ENV MYSQL_PORT=3306
ENV MYSQL_DATABASE=stylecart_db
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=rootpassword

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
