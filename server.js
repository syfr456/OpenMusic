/* eslint-disable no-console */
/* eslint-disable no-tabs */
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const songs = require('./src/api/songs');
const SongsService = require('./src/services/postgres/SongService');
const SongsValidator = require('./src/validator/songs');

const init = async () => {
  const songsService = new SongsService();

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
    plugin: songs,
    options: {
      service: songsService,
      validator: SongsValidator,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
