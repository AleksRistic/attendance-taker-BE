async function updateNextId(connection, callback) {
  console.log("Entered updateNextId");
  try {
    await connection.query(
      "UPDATE sequence SET id=LAST_INSERT_ID(id+1)",
      function (err, rows, fields) {
        if (err) throw err;

        return callback(rows[0]);
      }
    );
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

module.exports = { updateNextId };
