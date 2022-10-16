FROM node:16

WORKDIR /student-management
COPY package.json .
RUN npm install
RUN npm run test
COPY . .
CMD npm run start:dev