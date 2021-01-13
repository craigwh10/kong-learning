# NodeJS-API-KONG

‘What is KONG?

Kong is Orchestration Microservice API Gateway. Kong provides a flexible abstraction layer that securely manages communication between clients and microservices via API. Also known as an API Gateway, API middleware or in some cases Service Mesh. It is available as open-source project in 2015, its core values are high performance and extensibility.

Node base: https://medium.com/@far3ns/kong-the-microservice-api-gateway-526c4ca0cfa6

- Changed to use carbon alpine image after seeing https://getstream.io/blog/build-a-chat-app-with-stream-and-kong/#setting-up-the-chat-microservice.
- Added dockerignore to make node image smaller.
# Pre

```bash
// start a postgres container
docker run -d --name kong-database \
--network=kong-net \
-p 5555:5432 \
-e "POSTGRES_USER=kong" \
-e "POSTGRES_DB=kong" \
-e "POSTGRES_PASSWORD=kong" \
postgres:12.2

// prep database
docker run --rm \
--network=kong-net \
-e "KONG_DATABASE=postgres" \
-e "KONG_PG_HOST=kong-database" \
-e "KONG_PG_PASSWORD=kong" \
kong:2.0.3 kong migrations bootstrap

// start kong
docker run -d --name kong \
--network=kong-net \
--link kong-database:kong-database \
-e "KONG_DATABASE=postgres" \
-e "KONG_PG_HOST=kong-database" \
-e "KONG_PG_PASSWORD=kong" \
-e "KONG_PROXY_ACCESS_LOG=/dev/stdout" \
-e "KONG_ADMIN_ACCESS_LOG=/dev/stdout" \
-e "KONG_PROXY_ERROR_LOG=/dev/stderr" \
-e "KONG_ADMIN_ERROR_LOG=/dev/stderr" \
-e "KONG_ADMIN_LISTEN=0.0.0.0:8001, 0.0.0.0:8444 ssl" \
-p 8000:8000 \
-p 8443:8443 \
-p 8001:8001 \
-p 8444:8444 \
kong
```

Had installed kong related images and run them.

Check `docker network inspect kong-net` for the ipv4 of service we added via the docker-compose script, as you'll see it's
linked to the kong-net.

```bash
// Registering the service to kong
$ curl -i -X POST --url http://localhost:8001/services/ --data 'name=node-api' \
  --data 'url=http://172.23.0.4' --data 'port=10000'

// I had an issue where the port wasn't set properly which caused the error:
// An invalid response was received from the upstream server
// which was due to the port being set improperly, as it defaults to 80.

// I fixed this by doing a PATCH on the specific service, named node-api
// and updated the port directly

$ curl -i -X POST --url http://localhost:8001/services/node-api --data 'port=10000'
```


```bash
// Telling kong what to do when the service is hit
curl -i -X POST --url http://localhost:8001/services/node-api/routes \
  --data 'paths[]=/api/v1' --data 'strip_path=false' --data 'methods[]=GET' \
  --data 'methods[]=POST'
// Paths in the service, methods for what will be allowed to be used
```

# Notes

- `docker-compose up -d` needs to be run for service to work on `http://localhost:8000/api/v1/customers`.
- `localhost:8001` is for configuring kong, `localhost:8000` is for running the services based on kong config.