# Build stage - Ajustado para uma versão estável (3.9.6)
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /workspace

# Copia o repositório
COPY . /workspace

# Build do backend (que invoca o frontend pelo plugin)
RUN mvn -f backend/pom.xml clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copia o jar gerado
COPY --from=build /workspace/backend/target/*.jar /app/app.jar

# Configurações de porta para o Render
EXPOSE 8080
ENV PORT=8080

ENTRYPOINT ["java", "-Xmx512m", "-jar", "/app/app.jar"]
