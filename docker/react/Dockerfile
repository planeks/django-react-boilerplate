FROM node:18

COPY ./docker/react/entrypoint /entrypoint
RUN chmod +x /entrypoint

WORKDIR /opt/project

COPY ./frontend/package.json ./frontend/package-lock.json ./

RUN npm install
RUN npm install -g serve

ENV PATH ./node_modules/.bin:$PATH

WORKDIR /opt/project/src

COPY ./frontend ./

ENTRYPOINT ["/entrypoint"]