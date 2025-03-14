FROM node:alpine
RUN npm install -g serve
WORKDIR /app
COPY dist ./dist
EXPOSE 3008
CMD ["serve", "-s", "dist", "-l", "3008"]


