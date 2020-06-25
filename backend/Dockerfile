FROM node:carbon

# Assert entrypoint configuration
COPY ./docker/entrypoint.sh /entrypoint/backend/
RUN ["chmod", "+x", "entrypoint/backend/entrypoint.sh"]
ENTRYPOINT ["/entrypoint/backend/entrypoint.sh"]

# Copy/mount node app here
WORKDIR /data/backend
EXPOSE $SERVER_PORT
