# NodeJS-API-KONG

What is KONG?

Kong is Orchestration Microservice API Gateway. Kong provides a flexible abstraction layer that securely manages communication between clients and microservices via API. Also known as an API Gateway, API middleware or in some cases Service Mesh. It is available as open-source project in 2015, its core values are high performance and extensibility.

Node base: https://medium.com/@far3ns/kong-the-microservice-api-gateway-526c4ca0cfa6

- Changed to use carbon alpine image after seeing https://getstream.io/blog/build-a-chat-app-with-stream-and-kong/#setting-up-the-chat-microservice.
- Added dockerignore to make node image smaller.

### Todo

- Reduce complexity in startup

# Pre

```bash
$ chmod +x startkong.sh
$ ./startkong.sh
```

Had installed kong related images and run them.

Check `docker network inspect kong-net` for the ipv4 of service we added via the docker-compose script, as you'll see it's
linked to the kong-net.

```bash
# Telling kong what to do when the service is hit
curl -i -X POST --url http://localhost:8001/services/node-api/routes \
  --data 'paths[]=/api/v1' --data 'strip_path=false' --data 'methods[]=GET' \
  --data 'methods[]=POST'
# Paths in the service, methods for what will be allowed to be used
```

# Notes

- `docker-compose up -d` needs to be run for service to work on `http://localhost:8000/api/v1/customers`.
- `localhost:8001` is for configuring kong, `localhost:8000` is for running the services based on kong config.
- To add a new service you need to
    - Have an image of the service you want to add.
        - e.g `node-api-ts`
    - Get the IPv4 from docker network `docker network inspect network-name`
    - Add the service to docker compose attached to the docker network via post curl to port 8001.
        - `curl -i -X POST --url http://localhost:8001/services/ --data 'name=node-api-ts' --data 'url=http://172.23.0.4' --data 'port=10001'`
    - Then tell the service what to do when a path is hit.
    
Register service to kong
```bash
$ curl -i -X POST http://localhost:8001/services \
  --data name='node-api-ts' \
  --data url='http://172.23.0.4' \
  --data port='10001'
```
Update service on kong
```bash
$ curl -i -X PATCH http://localhost:8001/services/node-api --data "host=172.23.0.5"
```
Remove service on kong
```bash
# Need to have no references to the service, so need to delete endpoints too
$ curl -i -X DELETE http://localhost:8001/services/node_api_ts
```

Registering endpoint to kong
```bash
curl -i -X POST --url http://localhost:8001/services/node-api/routes \
  --data 'paths[]=/api/v1/customers' --data 'strip_path=false' --data 'methods[]=GET' \
  --data 'methods[]=POST'
```
Remove endpoint
```bash
curl -i -X DELETE --url http://localhost:8001/services/node-api/routes/71b08e5f-f39c-484d-8017-9d7d687b4794
```


# Setup

```bash
# Make it writeable & start kong containers
$ chmod +x startkong.sh
$ ./startkong.sh
# Build both the service images
$ docker-compose up -d
```