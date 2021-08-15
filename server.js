// mengimpor dotenv dan menjalankan konfigurasinya
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// error
const ClientError = require('./src/exceptions/ClientError');

// songs
const songs = require('./src/api/songs');
const SongsService = require('./src/services/postgres/SongsService');
const SongsValidator = require('./src/validator/songs');

// users
const users = require('./src/api/users');
const UsersService = require('./src/services/postgres/UsersService');
const UsersValidator = require('./src/validator/users');

// authentications
const authentications = require('./src/api/authentications');
const AuthenticationsService = require('./src/services/postgres/AuthenticationsService');
const TokenManager = require('./src/tokenize/TokenManager');
const AuthenticationsValidator = require('./src/validator/authentications');

// playlist
const playlists = require('./src/api/playlists');
const PlaylistService = require('./src/services/postgres/PlaylistsService');
const PlaylistsValidator = require('./src/validator/playlists');

// collaborations
const collaborations = require('./src/api/collaborations');
const CollaborationsService = require('./src/services/postgres/CollaborationsService');
const CollaborationsValidator = require('./src/validator/collaborations');

const init = async () => {
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistService(collaborationsService);
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    // console.log(response);
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return response.continue || response;
  });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
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
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        validator: CollaborationsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
