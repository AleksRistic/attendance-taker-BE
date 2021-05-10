const { getConnection } = require("../db/dbconnect");
const {
  retrieveStudents,
  getCourses,
  getStudentsForCourse,
  getStudentsPool,
  getFacialRecognitionData,
  getCurrentLessonId,
  getAttendanceResults,
  getNextId,
  getCourseName,
} = require("../services/retrieveData");
const {
  createLesson,
  createAttendanceRecord,
} = require("../services/insertData");
const {
  createFile,
  createDir,
  deleteFolder,
} = require("../util/createImageFolder");

async function retrieveStudentsReq(req, res) {
  const { studentId } = req.query;
  const connection = await getConnection();
  const result = await retrieveStudents(connection, studentId);
  return res.json(result);
}

async function getCoursesReq(req, res) {
  const connection = await getConnection();
  const result = await getCourses(connection);
  return res.json(result);
}

async function getCourseNameReq(req, res) {
  const { courseId } = req.query;
  const connection = await getConnection();
  const result = await getCourseName(connection, courseId);
  return res.json(result);
}

async function getStudentsForCourseReq(req, res) {
  const { courseId } = req.query;

  const connection = await getConnection();
  const students = await getStudentsForCourse(connection, courseId);
  let array = [];
  for (let student of students) {
    array.push(student.studentId);
  }
  let arr = array.join(",");
  const result = await retrieveStudents(connection, arr);
  return res.json(result);
}

async function getStudentsPoolReq(req, res) {
  const { courseId } = req.query;
  const connection = await getConnection();
  const studentIds = await getStudentsPool(connection, courseId);
  let array = [];
  for (let student of studentIds) {
    array.push(student.studentId);
  }
  let arr = array.join(",");
  const result = await retrieveStudents(connection, arr);
  return res.json(result);
}

const path = require("path");
// const { getNextIdReq } = require("./sequence");

//get students based on courseId and store their images in a temp folder. src/students
async function getFacialRecognitionDataReq(req, res) {
  try {
    const { courseId } = req.query;

    const connection = await getConnection();
    const connection1 = await getConnection();

    createDir("/students");
    const appDir = path.dirname(require.main.filename);

    const students = await getStudentsForCourse(connection, courseId);
    let array = [];
    for (let student of students) {
      array.push(student.studentId);
    }
    let arr = array.join(",");
    console.log("calling retrievestudents");
    const studentList = await retrieveStudents(connection, arr);
    for (let student of studentList) {
      const dirPath = `${appDir}/students/${student.student_id}.jpg`;
      createFile(dirPath, student.student_image);
    }

    //execute python script here
    const faceData = await getFacialRecognitionData(`${appDir}\\students`);

    //get individual students and set their status'

    const studentSplit = faceData.split("|");
    console.log(studentSplit);

    const present = studentSplit[0].split(",");
    const absent = studentSplit[1].split(",");

    //Create lesson
    const curLessonId = await createLesson(connection1, 123, courseId);
    //create attendance record

    for (let presentStudent of present) {
      console.log(`presentStudent: ${presentStudent}`);
      if (presentStudent) {
        await createAttendanceRecord(
          connection1,
          curLessonId,
          presentStudent,
          1,
          ""
        );
      }
    }
    console.log(absent);
    for (let absentStudent of absent) {
      console.log(`absentStudent: ${absentStudent}`);
      if (absentStudent !== "") {
        await createAttendanceRecord(
          connection1,
          curLessonId,
          absentStudent,
          0,
          ""
        );
      }
    }

    // Send back the attendance record with the
    const LessonIds = await getCurrentLessonId(connection1, courseId);
    //get the latest attendance lesson
    const currentLessonId = LessonIds[LessonIds.length - 1].lessonId;
    const attendanceResults = await getAttendanceResults(
      connection1,
      currentLessonId
    );
    console.log(attendanceResults[0]);
    connection1.end();
    // Erase images from temp folder
    for (let student of studentList) {
      const dirPath = `${appDir}/students/${student.student_id}.jpg`;
      deleteFolder(dirPath);
    }

    return res.json(attendanceResults);
  } catch (err) {
    console.log(err);
  }
}

async function getAttendanceForTable(req, res) {
  const { courseId } = req.query;
  try {
    const connection = await getConnection();
    // Send back the attendance record with the
    const LessonIds = await getCurrentLessonId(connection, courseId);
    //get the latest attendance lesson
    if (LessonIds.length === 0) res.json([]);
    const currentLessonId = LessonIds[LessonIds.length - 1].lessonId;
    const attendanceResults = await getAttendanceResults(
      connection,
      currentLessonId
    );

    return res.json(attendanceResults);
  } catch (err) {
    console.log(err);
  }
}

// TODO: create a studentId list that looks like: (id, id, id) and pass that into retrieveStudents and passback the arary from there
// touple maybe?
// after you get that working just make sure everything in the front end table is correct: id, image
// Dont think i need to call getStudentsforcourse in the modal, should get the oposite of that, just students that arent in the course.
module.exports = {
  retrieveStudentsReq,
  getCoursesReq,
  getCourseNameReq,
  getStudentsForCourseReq,
  getStudentsPoolReq,
  getFacialRecognitionDataReq,
  getAttendanceForTable,
};
