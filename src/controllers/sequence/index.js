const { updateNextId } = require("../../services/updateData");
const { getNextId } = require("../../services/retrieveData");
const { getConnection } = require("../../db/dbconnect");

async function getNextIdReq(callback) {
  const connection = await getConnection();
  await updateNextId(connection, (result) => {});
  await getNextId(connection, (result) => {
    return callback(result);
  });
}

module.exports = {
  getNextIdReq,
};
