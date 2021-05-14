const {
  updateNextId,
  updateStudentStatus,
  updateLessonStatus,
} = require("../services/updateData");
const { getCurrentLessonId } = require("../services/retrieveData");
const { getConnection } = require("../db/dbconnect");

async function updateNextIdReq(connection) {
  const id = await updateNextId(connection);
  return id;
}

async function updateStudentStatusReq(req, res) {
  const { studentId, courseId, status } = req.body;
  const connection = await getConnection();
  const lessonId = await getCurrentLessonId(connection, courseId);

  await updateStudentStatus(
    connection,
    studentId,
    lessonId[lessonId.length - 1].lessonId,
    status
  );
  await updateLessonStatus(
    connection,
    lessonId[lessonId.length - 1].lessonId,
    status
  );

  return res.json("Success");
}

module.exports = { updateNextIdReq, updateStudentStatusReq };
