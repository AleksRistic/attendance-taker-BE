const { updateNextId } = require("../services/updateData");

async function updateNextIdReq(connection) {
  const id = await updateNextId(connection);
  return id;
}

module.exports = { updateNextIdReq };
