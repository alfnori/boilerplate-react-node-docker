##!bin/sh
cd ..
docker-compose build --no-cache seed
docker-compose restart seed