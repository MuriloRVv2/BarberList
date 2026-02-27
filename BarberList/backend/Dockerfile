# Build stage
FROM maven:3.10.1-eclipse-temurin-21 AS build
WORKDIR /workspace

# Copy entire repository (we build backend which invokes frontend build via frontend-maven-plugin)
COPY . /workspace

# Build the backend (will run frontend build via plugin)
RUN mvn -f backend/pom.xml clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the packaged jar from the build stage
COPY --from=build /workspace/backend/target/*.jar /app/app.jar

# Expose the port
EXPOSE 8080
ENV PORT=8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
