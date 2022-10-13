FROM node:16

WORKDIR /student-management
COPY package.json .
RUN npm install
COPY . .
CMD npm run start:dev