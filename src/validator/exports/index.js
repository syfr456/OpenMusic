const ExportPlaylistPayloadSchema = require('./schema');
const InvariantEror = require('../../exceptions/InvariantError');

const ExportsValidator = {
  validateExportPlaylistPayload: (payload) => {
    const validationResult = ExportPlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantEror(validationResult.error.message);
    }
  },

};

module.exports = ExportsValidator;
