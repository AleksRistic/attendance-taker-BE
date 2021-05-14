const { Router } = require("express");
const {
  retrieveStudentsReq,
  getCoursesReq,
  getStudentsForCourseReq,
  getStudentsPoolReq,
  getFacialRecognitionDataReq,
  getAttendanceForTable,
  getCourseNameReq,
  checkCredentialsReq,
  getLessonDataReq,
} = require("./controllers/retrieveDataReq");
const { getNextIdReq } = require("./controllers/sequence");
const {
  createCourseReq,
  addStudentsToCourseReq,
  addNewStudentsReq,
  addInstructorReq,
} = require("./controllers/insertDataReq");

const { removeStudentFromClassReq } = require("./controllers/deleteData");
const { updateStudentStatusReq } = require("./controllers/updateDataReq");
const routes = new Router();

// routes.get(
//   '/detquest/getserviceinstancehtml',
//   SrtDetQuestController.getServiceInstanceHtml
// );

//GET
routes.get("/getstudents", retrieveStudentsReq);
routes.get("/getnextid", getNextIdReq);
routes.get("/getcourses", getCoursesReq);
routes.get("/getcoursename", getCourseNameReq);
routes.get("/getstudentsforcourse", getStudentsForCourseReq);
routes.get("/getstudentspool", getStudentsPoolReq);
routes.get("/getfacialrecogdata", getFacialRecognitionDataReq);
routes.get("/getattendacedata", getAttendanceForTable);
routes.get("/checkcredentials", checkCredentialsReq);
routes.get("/getlessondata", getLessonDataReq);

//POST
routes.post("/createcourse", createCourseReq);
routes.post("/addstudentstocourse", addStudentsToCourseReq);
routes.post("/addnewstudents", addNewStudentsReq);
routes.post("/signup", addInstructorReq);

//DELETE
routes.delete("/removestudentfromclass", removeStudentFromClassReq);

//PUT
routes.put("/updatestudentstatus", updateStudentStatusReq);

module.exports = routes;
