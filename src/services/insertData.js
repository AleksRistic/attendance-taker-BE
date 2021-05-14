const { getNextIdReq } = require("../controllers/sequence");
const util = require("util");

async function createCourse(
  connection,
  courseName,
  instructorName,
  courseDesc,
  courseImage
) {
  console.log("Entered createCourse");
  try {
    const query = util.promisify(connection.query).bind(connection);

    const courseId = await getNextIdReq();

    await query(
      "INSERT INTO `attendance-taker`.courses (courseId, courseName, instructorName, courseDesc, courseImage) VALUES (:courseId, :courseName, :instructorName, :courseDesc, BINARY(:courseImage))",
      { courseId, courseName, instructorName, courseDesc, courseImage }
    );

    return courseId;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

async function addNewStudents(connection, studentImage, studentId, fullName) {
  console.log("Entered addNewStudents");
  try {
    const query = util.promisify(connection.query).bind(connection);
    await query(
      "INSERT INTO `attendance-taker`.students (student_Id, student_full_name, student_image) VALUES (:studentId, :fullName, BINARY(:studentImage))",
      { studentId, fullName, studentImage }
    );
    return;
  } catch (err) {
    console.log(`error: ${err.message}`);
  } finally {
    connection.end();
    console.log("Closed Connection");
  }
}

async function addStudentsToCourse(connection, studentId, courseId) {
  console.log("Entered addStudentsToCourse");
  try {
    const query = util.promisify(connection.query).bind(connection);
    await query(
      "INSERT INTO `attendance-taker`.student_has_course (studentId, courseId) VALUES (:studentId, :courseId)",
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

async function createLesson(
  connection,
  instructorId,
  courseId,
  percentage,
  presentNum,
  absentNum
) {
  console.log("Entered createLesson");
  try {
    const query = util.promisify(connection.query).bind(connection);
    const lessonId = await getNextIdReq();

    await query(
      "INSERT INTO `attendance-taker`.lesson (lessonId, date, instructorId, courseId, percentagePresent, presentCount, absentCount) VALUES (:lessonId, CURDATE(), :instructorId, :courseId, :percentage, :presentNum, :absentNum) ",
      { lessonId, instructorId, courseId, percentage, presentNum, absentNum }
    );

    return lessonId;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

async function createAttendanceRecord(
  connection,
  lessonId,
  studentId,
  present,
  absentReason
) {
  console.log("Entered createAttendanceRecord");
  try {
    const query = util.promisify(connection.query).bind(connection);

    const attendanceId = await getNextIdReq();

    await query(
      "INSERT INTO `attendance-taker`.attendance (attendanceId, lessonId, studentId, present, absenceReason, timeTaken, dateTaken) VALUES (:attendanceId, :lessonId, :studentId, :present, :absentReason, CURRENT_TIME(), CURDATE())",
      { attendanceId, lessonId, studentId, present, absentReason }
    );

    return;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

//TODO: add image functionality and taken username
async function addInstructor(
  connection,
  firstName,
  lastName,
  email,
  instructorImage
) {
  console.log("Entered addInstructor");
  try {
    const query = util.promisify(connection.query).bind(connection);

    const instructorId = await getNextIdReq();

    await query(
      "INSERT INTO `attendance-taker`.instructors (instructorId, firstName, lastName, instructorImage, email) VALUES (:instructorId, :firstName, :lastName, :instructorImage, :email)",
      { instructorId, firstName, lastName, instructorImage, email }
    );

    return instructorId;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

async function addCredentials(connection, username, password, instructorId) {
  console.log("Entered addCredentials");
  try {
    const query = util.promisify(connection.query).bind(connection);

    await query(
      "INSERT INTO `attendance-taker`.credentials (username, password, instructorId) VALUES (:username, :password, :instructorId)",
      { username, password, instructorId }
    );

    return;
  } catch (err) {
    console.log(`error: ${err.message}`);
  } finally {
    connection.end();
    console.log("Closed Connection");
  }
}

async function addInstructorToCourse(connection, instructorId, courseId) {
  console.log("Entered addInstructorToCourse");
  try {
    const query = util.promisify(connection.query).bind(connection);

    await query(
      "INSERT INTO `attendance-taker`.instructor_has_course (instructorId, courseId) VALUES (:instructorId, :courseId)",
      { instructorId, courseId }
    );

    return;
  } catch (err) {
    console.log(`error: ${err.message}`);
  } finally {
    connection.end();
    console.log("Closed Connection");
  }
}

module.exports = {
  createCourse,
  addNewStudents,
  addStudentsToCourse,
  createLesson,
  createAttendanceRecord,
  addInstructor,
  addCredentials,
  addInstructorToCourse,
};
