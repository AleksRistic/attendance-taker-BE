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
  checkCredentials,
  getInstructorCourses,
  getLessonData,
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
  const { instructorId } = req.query;
  const connection = await getConnection();
  const ids = await getInstructorCourses(connection, instructorId);

  let array = [];
  for (let id of ids) {
    array.push(id.courseId);
  }
  let arr = array.join(",");
  const result = await getCourses(connection, arr);
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

    const studentList = await retrieveStudents(connection, arr);
    for (let student of studentList) {
      const dirPath = `${appDir}/students/${student.student_id}.jpg`;
      createFile(dirPath, student.student_image);
    }

    //execute python script here
    const faceData = await getFacialRecognitionData(`${appDir}\\students`);

    //get individual students and set their status'

    const studentSplit = faceData.split("|");

    const present = studentSplit[0].split(",");
    const absent = studentSplit[1].split(",");

    let total = 0;
    let pCount = 0;
    for (let p of present) {
      if (p !== "") {
        pCount++;
        total++;
      }
    }

    for (let a of absent) {
      if (a !== "") total++;
    }

    //Create lesson
    const curLessonId = await createLesson(
      connection1,
      123,
      courseId,
      (pCount / total) * 100,
      pCount,
      total - pCount
    );
    //create attendance record

    for (let presentStudent of present) {
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

    for (let absentStudent of absent) {
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
    if (LessonIds.length === 0) return res.json([]);
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

async function checkCredentialsReq(req, res) {
  const { username, password } = req.query;
  const connection = await getConnection();

  const result = await checkCredentials(connection, username, password);
  return res.json(result);
}

async function getLessonDataReq(req, res) {
  const { courseId } = req.query;
  const connection = await getConnection();

  const result = await getLessonData(connection, courseId);
  return res.json(result);
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
  checkCredentialsReq,
  getLessonDataReq,
};
