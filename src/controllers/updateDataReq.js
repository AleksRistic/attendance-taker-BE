const { updateNextId } = require("../services/updateData");

async function updateNextIdReq(connection) {
  updateNextId(connection, (result) => {
    return result;
  });
}

module.exports = { updateNextIdReq };
