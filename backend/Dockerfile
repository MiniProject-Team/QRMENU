FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

COPY . .

# ✅ ADD THIS LINE (FIX)
RUN chmod +x gradlew

# Build the project
RUN ./gradlew build

# Run the jar
CMD ["sh", "-c", "java -jar build/libs/*.jar"]