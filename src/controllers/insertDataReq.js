const { getConnection } = require("../db/dbconnect");
const {
  createCourse,
  addNewStudents,
  addStudentsToCourse,
} = require("../services/insertData");
const path = require("path");

async function createCourseReq(req, res) {
  const { courseName, instructorName, courseDesc } = req.body;

  const image = req.files.file.data;

  const connection = await getConnection();

  const result = await createCourse(
    connection,
    courseName,
    instructorName,
    courseDesc,
    image
  );
  return res.json(result);
}

//TODO: functionality for middle Names
async function addNewStudentsReq(req, res) {
  const { courseId } = req.body;
  const image = req.files.file.data;
  const nameParts = req.files.file.name.split("_");
  const studentId = nameParts[0];
  const fullName =
    nameParts[1] +
    " " +
    nameParts[nameParts.length - 1].slice(0, nameParts[2].indexOf("."));
  const lastName = nameParts[2].slice(0, nameParts[2].indexOf("."));

  const connection = await getConnection();

  await addNewStudents(connection, image, studentId, fullName);

  const connection1 = await getConnection();

  const result = await addStudentsToCourse(connection1, studentId, courseId);

  return res.json(result);
}

async function addStudentsToCourseReq(req, res) {
  const { studentId, courseId } = req.body;
  const connection = await getConnection();

  const result = await addStudentsToCourse(connection, studentId, courseId);
  return res.json(result);
}

// CMPT 110
// Dr. Joshua Robertson
// Lorem Ipsum is dummy text of the printing and typesetting industry.
module.exports = { createCourseReq, addStudentsToCourseReq, addNewStudentsReq };
