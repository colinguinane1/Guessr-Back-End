FROM node:22-alpine
ENV NODE_ENV=production
ENV PORT=8080
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "start"]

