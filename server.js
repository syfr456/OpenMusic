/* eslint-disable no-console */
require('dotenv').config();
const Hapi = require('@hapi/hapi');
const SongService = require('./src/services/postgres/SongService');
const SongValidator = require('./src/validator/songs');

const init = async () => {
  const songService = new SongService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: songService,
    options: {
      service: songService,
      validator: SongValidator,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
