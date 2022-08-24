FROM insait/cube.js:1.0.3

RUN mv /cubejs/insait /cubejs/insait.tar.gz
RUN mv /cubejs/insait-front /cubejs/insait-front.tar.gz

RUN mv /cubejs/packages/cubejs-docker/conf/insait.tar.gz /cubejs

RUN tar -xvzf /cubejs/insait.tar.gz
RUN tar -xvzf /cubejs/insait-front.tar.gz

WORKDIR /cube/conf

EXPOSE 4000

CMD ["cubejs", "server"]