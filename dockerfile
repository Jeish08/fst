# Use Node.js as the base image
FROM node:14-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the app's source code
COPY . .

# Expose the port that CRA runs on
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
