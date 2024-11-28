FROM node:22-alpine
ENV NODE_ENV=production
ENV PORT=8080
WORKDIR /app
COPY package*.json .
RUN npm install
RUN ls node_modules
RUN ls node_modules/@types
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "start"]

