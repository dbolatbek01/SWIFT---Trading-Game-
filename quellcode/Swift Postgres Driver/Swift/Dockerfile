# 1. Bulding Stage 
FROM gradle:8.4.0-jdk17-alpine AS builder

WORKDIR /app

# copy Gradle Configuration 
COPY build.gradle settings.gradle gradle.properties ./
COPY gradle ./gradle

# copy Sourcecode 
COPY src ./src

# build jar-File
RUN gradle build --no-daemon

# 2. Production Stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# take builded jar-File
COPY --from=builder /app/build/libs/Swift-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
