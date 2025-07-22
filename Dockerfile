FROM cypress/included:12.17.4
WORKDIR /e2e
COPY . .
RUN npm ci
