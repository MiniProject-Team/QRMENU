# Use official Java image
FROM eclipse-temurin:17-jdk-alpine

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Build the project
RUN ./gradlew build

# Run the jar file
CMD ["sh", "-c", "java -jar build/libs/*.jar"]