//* eslint-disable no-tabs */
require('dotenv').config();

const Hapi = require('@hapi/hapi');

// songs
const songs = require('./src/api/songs');
const SongsService = require('./src/services/postgres/SongService');
const SongsValidator = require('./src/validator/songs');

// users
const users = require('./src/api/users');
const UsersService = require('./src/services/postgres/UsersService');
const UsersValidator = require('./src/validator/users');

const init = async () => {
  const songsService = new SongsService();
  const usersService = new UsersService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
