const util = require("util");

async function removeStudentFromAttendance(connection, studentId) {
  console.log("Entered removeStudentFromClass");
  try {
    const query = util.promisify(connection.query).bind(connection);

    await query(
      "delete from `attendance-taker`.attendance WHERE studentId=:studentId and dateTaken=curdate()",
      { studentId }
    );
    return;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

async function removeStudentFromCourse(connection, studentId, courseId) {
  console.log("Entered removeStudentFromClass");
  try {
    const query = util.promisify(connection.query).bind(connection);

    await query(
      "delete from `attendance-taker`.student_has_course WHERE studentId=:studentId and courseId=:courseId",
      { studentId, courseId }
    );
    return;
  } catch (err) {
    console.log(`error: ${err.message}`);
  } finally {
    connection.end();
    console.log("Closed Connection");
  }
}

module.exports = { removeStudentFromAttendance, removeStudentFromCourse };
