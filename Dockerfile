FROM node:22-alpine3.22

COPY . /application_tracker/

WORKDIR /application_tracker

RUN npm i

ENTRYPOINT [ "npm" ]

CMD [ "run", "build" ]
