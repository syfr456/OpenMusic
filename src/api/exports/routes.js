const routes = (handler) => [
  {
    method: 'POST',
    path: '/exports/playlist/{playlisId}',
    handler: handler.postExportPlaylistHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
