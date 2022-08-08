FROM insait/cube.js:1.0.2

RUN mv /cubejs/insait /cubejs/insait.tar.gz
RUN mv /cubejs/insait-front /cubejs/insait-front.tar.gz

RUN tar -xvzf /cubejs/insait.tar.gz
RUN tar -xvzf /cubejs/insait-front.tar.gz

WORKDIR /cube/conf

EXPOSE 4000

CMD ["cubejs", "server"]