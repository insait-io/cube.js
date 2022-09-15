FROM insait/cube.js:0.1.4

ARG IMAGE_VERSION=unknown

ENV CUBEJS_DOCKER_IMAGE_VERSION=$IMAGE_VERSION
ENV CUBEJS_DOCKER_IMAGE_TAG=alpine

ENV TERM rxvt-unicode
ENV NODE_ENV production

WORKDIR /cube
COPY . .



WORKDIR /cube/conf

EXPOSE 4000

CMD ["cubejs", "server"]
