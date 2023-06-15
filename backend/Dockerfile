FROM golang:1.19-alpine AS build
RUN apk add build-base

WORKDIR /app
COPY . .
RUN go build -o backend main.go

FROM golang:1.19-alpine AS run
COPY --from=build /app/backend /app/backend

CMD /app/backend