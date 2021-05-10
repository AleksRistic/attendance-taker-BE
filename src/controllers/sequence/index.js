const { updateNextId } = require("../../services/updateData");
const { getNextId } = require("../../services/retrieveData");
const { getConnection } = require("../../db/dbconnect");

async function getNextIdReq() {
  const connection = await getConnection();
  await updateNextId(connection);
  const nextId = await getNextId(connection);
  return nextId;
}

module.exports = {
  getNextIdReq,
};
