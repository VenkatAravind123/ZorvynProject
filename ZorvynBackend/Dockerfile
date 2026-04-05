# Build stage
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /app/target/ZorvynBackend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 5001
ENV PORT=5001
CMD ["java", "-jar", "app.jar"]