const { getConnection } = require("../db/dbconnect");
const {
  removeStudentFromAttendance,
  removeStudentFromCourse,
} = require("../services/deleteData");
const {
  getAttendanceResults,
  getCurrentLessonId,
} = require("../services/retrieveData");
const { updateLessonStatus } = require("../services/updateData");

async function removeStudentFromClassReq(req, res) {
  const { studentId, courseId } = req.body;
  try {
    const connection = await getConnection();

    const lessonId = await getCurrentLessonId(connection, courseId);
    console.log(lessonId);
    console.log(lessonId.length);

    let status = 0;
    if (lessonId.length > 0) {
      console.log("inside");
      const attendance = await getAttendanceResults(
        connection,
        lessonId[lessonId.length - 1].lessonId
      );

      for (let student of attendance) {
        if (student.studentId === studentId) {
          if (student.present === 1) {
            status = 3;
          } else {
            status = 4;
          }
        }
      }
    }
    console.log({ status });
    await removeStudentFromAttendance(connection, studentId);

    await removeStudentFromCourse(connection, studentId, courseId);

    const connection1 = await getConnection();
    //update Student Status
    if (lessonId.length > 0) {
      await updateLessonStatus(
        connection1,
        lessonId[lessonId.length - 1].lessonId,
        status
      );
    }

    return res.json("Success");
  } catch (err) {
    console.log(err);
  }
}

module.exports = { removeStudentFromClassReq };
