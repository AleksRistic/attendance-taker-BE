function retrieveStudents(connection, studentIds, callback) {
  console.log("Entered retrieveStudents");
  if (studentIds === "") studentIds = 0;

  const sql =
    "SELECT * FROM `attendance-taker`.students WHERE student_Id IN (" +
    studentIds +
    ")";

  try {
    connection.query(sql, function (err, rows, fields) {
      if (err) throw err;
      return callback(rows);
    });
  } catch (err) {
    console.log(`error: ${err.message}`);
  } finally {
    connection.end();
    console.log("Closed Connection");
  }
}

async function getNextId(connection, callback) {
  console.log("Entered getNextId");
  try {
    await connection.query(
      "SELECT LAST_INSERT_ID()",
      function (err, rows, fields) {
        if (err) throw err;
        return callback(rows[0]["LAST_INSERT_ID()"]);
      }
    );
  } catch (err) {
    console.log(`error: ${err.message}`);
  } finally {
    connection.end();
    console.log("Closed Connection");
  }
}

function getCourses(connection, callback) {
  console.log("Entered getCourses");
  try {
    connection.query(
      "SELECT * FROM `attendance-taker`.courses ORDER BY courseId DESC",

      function (err, rows, fields) {
        if (err) throw err;

        return callback(rows);
      }
    );
  } catch (err) {
    console.log(`error: ${err.message}`);
  } finally {
    connection.end();
    console.log("Closed Connection");
  }
}

function getStudentsForCourse(connection, courseId, callback) {
  console.log("Entered getStudentsForCourse");
  try {
    connection.query(
      "SELECT * FROM `attendance-taker`.student_has_course WHERE courseId=:courseId",
      { courseId },
      function (err, rows, fields) {
        if (err) throw err;

        return callback(rows);
      }
    );
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

function getStudentsPool(connection, courseId, callback) {
  console.log("Entered getStudentsPool");
  try {
    connection.query(
      "SELECT DISTINCT studentId FROM `attendance-taker`.student_has_course WHERE courseId != :courseId AND studentId not in (select studentId from `attendance-taker`.student_has_course where courseId=:courseId)",
      { courseId },
      function (err, rows, fields) {
        if (err) throw err;
        console.log(rows);
        return callback(rows);
      }
    );
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

const path = require("path");
const { spawn } = require("child_process");
const { PythonShell } = require("python-shell");
//"c:/Users/Aleksa/attendance-taker-BE/src/facialRecog/facialRecognition.py"
function getFacialRecognitionData(studentPath, callback) {
  console.log("Entered getFacialRecog *****************");

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

  PythonShell.run("facialRecognition.py", options, function (err, result) {
    if (err) throw err;
    // result is an array consisting of messages collected
    //during execution of script.
    console.log("result: ", result.toString());
    callback(result.toString());
  });

  // console.log(scriptDir);
  // const pyProg = spawn("python3", [
  //   __dirname + `../facialRecog/facialRecognition.py`,
  //   studentPath,
  // ]);

  // pyProg.stdout.on("data", (data) => {
  //   console.log(data.toString());
  //   callback(data.toString());
  //   console.log("done");
  // });

  // pyProg.on("close", (code) => {
  //   console.log(`child process close all stdio with code ${code}`);
  //   // send data to browser
  // });
}

module.exports = {
  retrieveStudents,
  getNextId,
  getCourses,
  getStudentsForCourse,
  getStudentsPool,
  getFacialRecognitionData,
};

// Convert backend to async structure to avoid callback hell. will make life much simpler.
// https://codeburst.io/node-js-mysql-and-async-await-6fb25b01b628
