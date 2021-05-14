const util = require("util");

async function retrieveStudents(connection, studentIds) {
  console.log("Entered retrieveStudents");
  if (studentIds === "") studentIds = 0;

  const sql =
    "SELECT * FROM `attendance-taker`.students WHERE student_Id IN (" +
    studentIds +
    ")";

  try {
    const query = util.promisify(connection.query).bind(connection);

    const students = await query(sql);
    return students;
  } catch (err) {
    console.log(`error: ${err.message}`);
  } finally {
    connection.end();
    console.log("Closed Connection");
  }
}

async function getNextId(connection) {
  console.log("Entered getNextId");
  try {
    const query = util.promisify(connection.query).bind(connection);

    const id = await query("SELECT LAST_INSERT_ID()");
    return id[0]["LAST_INSERT_ID()"];
  } catch (err) {
    console.log(`error: ${err.message}`);
  } finally {
    connection.end();
    console.log("Closed Connection");
  }
}

async function getCourses(connection, courseIds) {
  console.log("Entered getCourses");

  try {
    const query = util.promisify(connection.query).bind(connection);
    if (courseIds.length === 0) courseIds = 0;
    const sql =
      "SELECT * FROM `attendance-taker`.courses WHERE courseId in (" +
      courseIds +
      ") ORDER BY courseId DESC";

    const courses = await query(sql);

    return courses;
  } catch (err) {
    console.log(`error: ${err.message}`);
  } finally {
    connection.end();
    console.log("Closed Connection");
  }
}

async function getCourseName(connection, courseId) {
  console.log("Entered getCourseName");
  try {
    const query = util.promisify(connection.query).bind(connection);

    const courseName = await query(
      "SELECT courseName FROM `attendance-taker`.courses WHERE courseId=:courseId",
      { courseId }
    );

    return courseName[0];
  } catch (err) {
    console.log(`error: ${err.message}`);
  } finally {
    connection.end();
    console.log("Closed Connection");
  }
}

async function getStudentsForCourse(connection, courseId) {
  console.log("Entered getStudentsForCourse");
  try {
    const query = util.promisify(connection.query).bind(connection);

    const students = await query(
      "SELECT * FROM `attendance-taker`.student_has_course WHERE courseId=:courseId",
      { courseId }
    );

    return students;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

async function getStudentsPool(connection, courseId) {
  console.log("Entered getStudentsPool");
  try {
    const query = util.promisify(connection.query).bind(connection);

    const pool = await query(
      "SELECT DISTINCT studentId FROM `attendance-taker`.student_has_course WHERE courseId != :courseId AND studentId not in (select studentId from `attendance-taker`.student_has_course where courseId=:courseId)",
      { courseId }
    );

    return pool;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

const path = require("path");
const { PythonShell } = require("python-shell");
//"c:/Users/Aleksa/attendance-taker-BE/src/facialRecog/facialRecognition.py"
async function getFacialRecognitionData(studentPath) {
  console.log("Entered getFacialRecog *");

  const appDir = path.dirname(require.main.filename);
  const scriptDir = `${appDir}\\facialRecog\\facialRecognition.py`;

  let options = {
    mode: "text",
    pythonPath:
      "C:\\Users\\Aleksa\\AppData\\Local\\Programs\\Python\\Python36\\python.exe",
    pythonOptions: ["-u"], // get print results in real-time
    scriptPath: "c:/Users/Aleksa/attendance-taker-BE/src/facialRecog", //If you are having python_test.py script in same folder, then it's optional.
    args: [studentPath], //An argument which can be accessed in the script using sys.argv[1]
  };

  return new Promise((resolve, reject) => {
    try {
      PythonShell.run("facialRecognition.py", options, function (err, result) {
        if (err) console.log(err);

        resolve(result.toString());
      });
    } catch (err) {
      console.log("error running script");
      reject();
    }
  });
}

// can only delete users if there is a lesson today
async function getCurrentLessonId(connection, courseId) {
  console.log("Entered getCurrentLessonId");
  try {
    const query = util.promisify(connection.query).bind(connection);

    const lessonId = await query(
      "SELECT lessonId FROM `attendance-taker`.lesson WHERE date = CURDATE() AND courseId=:courseId",
      { courseId }
    );

    return lessonId;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

async function getAttendanceResults(connection, lessonId) {
  console.log("Entered getAttendanceResults");

  try {
    const query = util.promisify(connection.query).bind(connection);

    const attendanceResult = await query(
      "SELECT * FROM `attendance-taker`.attendance WHERE lessonId=:lessonId",
      { lessonId }
    );

    return attendanceResult;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

async function checkCredentials(connection, username, password) {
  console.log("Entered checkCredentials");
  try {
    const query = util.promisify(connection.query).bind(connection);

    const RealPassword = await query(
      "SELECT password, instructorId FROM `attendance-taker`.credentials WHERE username=:username",
      { username }
    );

    if (RealPassword.length !== 0 && password === RealPassword[0].password)
      return RealPassword[0].instructorId;

    return "Incorrect";
  } catch (err) {
    console.log(`error: ${err.message}`);
  } finally {
    connection.end();
    console.log("Closed Connection");
  }
}

async function getInstructorCourses(connection, instructorId) {
  console.log("Entered getInstructorCourses");
  try {
    const query = util.promisify(connection.query).bind(connection);

    const ids = await query(
      "SELECT courseId FROM `attendance-taker`.instructor_has_course WHERE instructorId=:instructorId",
      { instructorId }
    );

    return ids;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

async function getLessonData(connection, courseId) {
  console.log("Entered getLessonData");
  try {
    const query = util.promisify(connection.query).bind(connection);

    const lessonData = await query(
      "SELECT * FROM `attendance-taker`.lesson WHERE date=CURDATE()",
      { courseId }
    );

    return lessonData;
  } catch (err) {
    console.log(`error: ${err.message}`);
  } finally {
    connection.end();
    console.log("Closed Connection");
  }
}

module.exports = {
  retrieveStudents,
  getNextId,
  getCourses,
  getStudentsForCourse,
  getStudentsPool,
  getFacialRecognitionData,
  getCurrentLessonId,
  getAttendanceResults,
  getCourseName,
  checkCredentials,
  getInstructorCourses,
  getLessonData,
};

// Convert backend to async structure to avoid callback hell. will make life much simpler.
// https://codeburst.io/node-js-mysql-and-async-await-6fb25b01b628
