FROM node:22 as builder

WORKDIR /app

COPY package-lock.json .
COPY package.json .
RUN npm ci 


ARG ARG_NEXT_PUBLIC_API_URL
ARG ARG_NEXT_PUBLIC_COGNITO_USER_POOL_ID
ARG ARG_NEXT_PUBLIC_COGNITO_CLIENT_ID

ENV NEXT_PUBLIC_API_URL=${ARG_NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_COGNITO_USER_POOL_ID=${ARG_NEXT_PUBLIC_COGNITO_USER_POOL_ID}
ENV NEXT_PUBLIC_COGNITO_CLIENT_ID=${ARG_NEXT_PUBLIC_COGNITO_CLIENT_ID}


COPY . . 
RUN npm run build 


FROM node:22-slim as runner 
WORKDIR /app
COPY --from=builder --chown=node:node  /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
EXPOSE 3000

USER node
CMD ["node","server.js"]