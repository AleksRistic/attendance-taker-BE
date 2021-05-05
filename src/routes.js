const { Router } = require("express");
const {
  retrieveStudentsReq,

  getCoursesReq,
  getStudentsForCourseReq,
  getStudentsPoolReq,
  getFacialRecognitionDataReq,
} = require("./controllers/retrieveDataReq");
const { getNextIdReq } = require("./controllers/sequence");
const {
  createCourseReq,
  addStudentsToCourseReq,
  addNewStudentsReq,
} = require("./controllers/insertDataReq");
const routes = new Router();

// routes.get(
//   '/detquest/getserviceinstancehtml',
//   SrtDetQuestController.getServiceInstanceHtml
// );

//GET
routes.get("/getstudents", retrieveStudentsReq);
routes.get("/getnextid", getNextIdReq);
routes.get("/getcourses", getCoursesReq);
routes.get("/getstudentsforcourse", getStudentsForCourseReq);
routes.get("/getstudentspool", getStudentsPoolReq);
routes.get("/getfacialrecogdata", getFacialRecognitionDataReq);

//POST
routes.post("/createcourse", createCourseReq);
routes.post("/addstudentstocourse", addStudentsToCourseReq);
routes.post("/addnewstudents", addNewStudentsReq);

module.exports = routes;
