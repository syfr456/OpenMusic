require('dotenv').config();
const Hapi = require('@hapi/hapi');
const notes = require('./src/api/notes');
const NotesService = require('./src/services/postgres/0penMusicService');
const NotesValidator = require('./src/validator/notes');

const init = async () => {
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
		plugin: notes,
		options: {
			service,
		},
	});
};
