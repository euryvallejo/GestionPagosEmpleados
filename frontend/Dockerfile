FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Use vite preview with specific host and port
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "3000"]