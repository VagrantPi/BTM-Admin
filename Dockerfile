# Use the official Node.js image
FROM node:23.3

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port (if needed)
EXPOSE 8080

# Command to run the application (if needed)
CMD npm run dev 