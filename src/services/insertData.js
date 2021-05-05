const { getNextIdReq } = require("../controllers/sequence");

async function createCourse(
  connection,
  courseName,
  instructorName,
  courseDesc,
  courseImage,
  callback
) {
  try {
    console.log("Entered createCourse");
    await getNextIdReq((courseId) => {
      const dbName = "`attendance-taker`.courses";

      connection.query(
        "INSERT INTO `attendance-taker`.courses (courseId, courseName, instructorName, courseDesc, courseImage) VALUES (:courseId, :courseName, :instructorName, :courseDesc, BINARY(:courseImage))",
        { courseId, courseName, instructorName, courseDesc, courseImage },
        function (err, rows, fields) {
          if (err) throw err;

          return callback(rows);
        }
      );
      connection.end();
      console.log("Closed Connection");
    });
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

async function addNewStudents(
  connection,
  studentImage,
  studentId,
  fullName,
  callback
) {
  try {
    console.log("Entered addNewStudents");

    connection.query(
      "INSERT INTO `attendance-taker`.students (student_Id, student_full_name, student_image) VALUES (:studentId, :fullName, BINARY(:studentImage))",
      { studentId, fullName, studentImage },
      function (err, rows, fields) {
        if (err) callback(err);

        return callback(rows);
      }
    );
    connection.end();
    console.log("Closed Connection");
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

async function addStudentsToCourse(connection, studentId, courseId, callback) {
  try {
    console.log("Entered addStudentsToCourse");
    connection.query(
      "INSERT INTO `attendance-taker`.student_has_course (studentId, courseId) VALUES (:studentId, :courseId)",
      { studentId, courseId },
      function (err, rows, fields) {
        if (err) callback(err);

        return callback(rows);
      }
    );
    connection.end();
    console.log("Closed Connection");
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

async function createLesson(connection, instructorId, courseId, callback) {
  try {
    console.log("Entered createLesson");
    await getNextIdReq((lessonId) => {
      connection.query(
        "INSERT INTO `attendance-taker`.lesson (lessonId, date, instructorId, courseId) VALUES (:lessonId, CURDATE(), :instructorId, :courseId) ",
        { lessonId, instructorId, courseId },
        function (err, rows, fields) {
          if (err) throw err;

          return callback(rows);
        }
      );
      connection.end();
      console.log("Closed Connection");
    });
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

async function createAttendanceRecord(
  connection,
  lessonId,
  studentId,
  present,
  absentReason,
  callback
) {
  try {
    console.log("Entered createLesson");
    await getNextIdReq((attendanceId) => {
      connection.query(
        "INSERT INTO `attendance-taker`.attendance (attendanceId, lessonId, studentId, present, absenceReason) VALUES (:attendanceId, :lessonId, :studentId, :present, :absentReason)",
        { attendanceId, lessonId, studentId, present, absentReason },
        function (err, rows, fields) {
          if (err) throw err;

          return callback(rows);
        }
      );
      connection.end();
      console.log("Closed Connection");
    });
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

module.exports = {
  createCourse,
  addNewStudents,
  addStudentsToCourse,
  createLesson,
  createAttendanceRecord,
};
