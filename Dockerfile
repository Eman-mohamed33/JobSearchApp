FROM node:22.15.0 as base
WORKDIR /app
COPY package*.json ./

FROM base as dev
RUN npm i
COPY . .
CMD [ "npm", "run", "start:dev" ]

FROM base AS builder
RUN npm i
COPY . .
RUN npm run build


FROM base as prod
RUN npm i --only=production

COPY --from=builder /app/dist ./dist

CMD [ "npm", "run", "start:prod" ]
