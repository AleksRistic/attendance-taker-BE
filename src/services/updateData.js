const util = require("util");

async function updateNextId(connection) {
  console.log("Entered updateNextId");
  try {
    const query = util.promisify(connection.query).bind(connection);
    const id = await query("UPDATE sequence SET id=LAST_INSERT_ID(id+1)");

    return id[0];
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

module.exports = { updateNextId };
