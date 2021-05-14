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

async function updateStudentStatus(connection, studentId, lessonId, status) {
  console.log("Entered updateStudentStatus");
  try {
    const query = util.promisify(connection.query).bind(connection);
    const id = await query(
      "UPDATE `attendance-taker`.attendance SET present=:status WHERE lessonId=:lessonId AND studentId=:studentId",
      { status, lessonId, studentId }
    );

    return;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

async function updateLessonStatus(connection, lessonId, status) {
  console.log("Entered updateLessonStatus");

  try {
    const query = util.promisify(connection.query).bind(connection);

    let sql;

    if (status === 0) {
      sql =
        "UPDATE `attendance-taker`.lesson SET presentCount=presentCount-1, absentCount=absentCount+1, percentagePresent=(presentCount/(presentCount+absentCount))*100 WHERE lessonId=:lessonId ";
    } else if (status === 1) {
      sql =
        "UPDATE `attendance-taker`.lesson SET presentCount=presentCount+1, absentCount=absentCount-1, percentagePresent=(presentCount/(presentCount+absentCount))*100 WHERE lessonId=:lessonId ";
    } else if (status === 3) {
      sql =
        "UPDATE `attendance-taker`.lesson SET presentCount=presentCount-1, percentagePresent=(presentCount/(presentCount+absentCount))*100 WHERE lessonId=:lessonId ";
    } else if (status === 4) {
      sql =
        "UPDATE `attendance-taker`.lesson SET absentCount=absentCount-1, percentagePresent=(presentCount/(presentCount+absentCount))*100 WHERE lessonId=:lessonId ";
    }

    await query(sql, { lessonId });

    return;
  } catch (err) {
    console.log(`error: ${err.message}`);
  } finally {
    connection.end();
    console.log("Closed Connection");
  }
}

module.exports = { updateNextId, updateStudentStatus, updateLessonStatus };
