const { getConnection } = require("../db/dbconnect");
const {
  retrieveStudents,
  getCourses,
  getStudentsForCourse,
  getStudentsPool,
  getFacialRecognitionData,
} = require("../services/retrieveData");
const { createLesson } = require("../services/insertData");
const {
  createFile,
  createDir,
  deleteFolder,
} = require("../util/createImageFolder");

async function retrieveStudentsReq(req, res) {
  const { studentId } = req.query;
  const connection = await getConnection();
  retrieveStudents(connection, studentId, (result) => {
    return res.json(result);
  });
}

async function getCoursesReq(req, res) {
  const connection = await getConnection();
  getCourses(connection, (result) => {
    return res.json(result);
  });
}

async function getStudentsForCourseReq(req, res) {
  const { courseId } = req.query;

  const connection = await getConnection();
  getStudentsForCourse(connection, courseId, (students) => {
    let array = [];
    for (let student of students) {
      array.push(student.studentId);
    }
    let arr = array.join(",");
    retrieveStudents(connection, arr, (result) => {
      return res.json(result);
    });
  });
}

async function getStudentsPoolReq(req, res) {
  const { courseId } = req.query;
  const connection = await getConnection();
  getStudentsPool(connection, courseId, (studentIds) => {
    let array = [];
    for (let student of studentIds) {
      array.push(student.studentId);
    }
    let arr = array.join(",");
    retrieveStudents(connection, arr, (result) => {
      return res.json(result);
    });
  });
}
const path = require("path");

//get students based on courseId and store their images in a temp folder. src/students
async function getFacialRecognitionDataReq(req, res) {
  console.log("Entred");
  const { courseId } = req.query;
  console.log(courseId);
  const connection = await getConnection();
  const connection1 = await getConnection();

  createDir("/students");
  const appDir = path.dirname(require.main.filename);
  console.log(appDir);

  getStudentsForCourse(connection, courseId, (students) => {
    let array = [];
    for (let student of students) {
      array.push(student.studentId);
    }
    let arr = array.join(",");
    console.log("calling retrievestudents");
    retrieveStudents(connection, arr, (studentList) => {
      for (let student of studentList) {
        const dirPath = `${appDir}/students/${student.student_id}.jpg`;
        createFile(dirPath, student.student_image);
      }

      console.log(`${appDir}\\students`);
      //execute python script here
      getFacialRecognitionData(`${appDir}\\students`, (result) => {
        console.log(result);

        //get individual students and set their status'

        const students = result.split("|");
        console.log(students);

        const present = students[0].split(",");
        const absent = students[1].split(",");

        console.log(present);
        console.log(absent);

        //Create lesson
        createLesson(connection1, 123, courseId, (result) => {
          //create attendance record

          // Erase images from temp folder
          for (let student of studentList) {
            const dirPath = `${appDir}/students/${student.student_id}.jpg`;
            deleteFolder(dirPath);
          }

          return res.json(result);
        });
      });
    });
  });
}

// TODO: create a studentId list that looks like: (id, id, id) and pass that into retrieveStudents and passback the arary from there
// touple maybe?
// after you get that working just make sure everything in the front end table is correct: id, image
// Dont think i need to call getStudentsforcourse in the modal, should get the oposite of that, just students that arent in the course.
module.exports = {
  retrieveStudentsReq,
  getCoursesReq,
  getStudentsForCourseReq,
  getStudentsPoolReq,
  getFacialRecognitionDataReq,
};
