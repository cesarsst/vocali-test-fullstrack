# Use the official Node.js image as the base image
FROM node:22

# Set the working directory
WORKDIR /backend

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy the rest of the application code
COPY . .

# Install dependencies
RUN npm install

# Build the Nest.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application 
CMD ["npm", "run", "start"]