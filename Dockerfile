# Root Dockerfile - builds frontend and backend together
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /workspace

# Copy backend and frontend into the image so the backend's frontend-maven-plugin
# can find the ../frontend directory during `mvn package`.
COPY BarberList/backend /workspace/backend
COPY BarberList/frontend /workspace/frontend

WORKDIR /workspace/backend
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /workspace/backend/target/*.jar /app/app.jar

EXPOSE 8080
ENV PORT=8080

ENTRYPOINT ["java", "-Xmx512m", "-jar", "/app/app.jar"]
