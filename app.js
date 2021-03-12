const inquirer = require("inquirer");

//get the client
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Mysql123!",
  database: "business_tracker",
});

// Start
function Prompt() {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "options",
        message: "What would you like to do? (Check all that apply)",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
        ],
      },
    ])
    .then(({ options }) => {
      if (options == "View all departments") {
        // Call function to handle All departments option
        viewAllDepartments(pool);
      } else if (options == "View all roles") {
        //Call function to handle View all roles option
        viewAllRoles();
      } else if (options == "View all employees") {
        //Call function to handle View all employees option
        wiewAllEmployees();
      } else if (options == "Add a department") {
        //Call function to handle Add a department option
        addDepartment();
      } else if (options == "Add a role") {
        //Call function to handle Add a department option
        addRole();
      } else if (options == "Add an employee") {
        //Call function to handle Add a department option
        addEmployee();
      } else if (options == "Update an employee role") {
        //Call function to handle Add a department option
        updateEmployeeRole();
      }
    });
}

async function viewAllDepartments() {
  // Use query to bring the list of all departments
  const [rows, fields] = await pool.execute("SELECT * FROM department");
  console.table(rows);
  Prompt();
}

async function viewAllRoles() {
  // Use query to bring the list of all departments
  const [rows, fields] = await pool.query(
    `SELECT role.title, role.id AS role_id, department.name AS Department, role.salary 
     FROM role INNER JOIN department ON role.department_id = department.id ORDER BY role_id`
  );
  console.table(rows);
  Prompt();
}

async function wiewAllEmployees() {
  // Query to view employees
  var strQuery = `SELECT e.id, e.first_name, e.last_name, role.title AS job_title, department.name AS departmentes, role.salary AS salaries, Concat(m.first_name,' ', m.last_name) AS manager 
    FROM employee e 
    LEFT JOIN employee m ON e.manager_id = m.id 
    LEFT JOIN role ON e.role_id=role.id 
    LEFT JOIN department ON role.department_id=department.id`;
  const [rows, fields] = await pool.query(strQuery);
  console.table(rows);
  Prompt();
}

// query to add a department
async function addDepartment() {
  return inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What Department would you like to add?",
      },
    ])
    .then(async function (res) {
      var strQuery = `INSERT INTO department (name) value ('${res.name}');`;
      const [rows, fields] = await pool.query(strQuery);
      console.log("The new department has been added.");
      Prompt();
    });
}

// Query to add a new role
async function addRole() {
  var arrChoices = await getDepartmentsList();
  return inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "What is the title you want to add?",
      },
      {
        name: "salary",
        type: "input",
        message: "What is the salary?",
      },
      {
        name: "department",
        type: "list",
        message: "What is the department?",
        choices: arrChoices,
      },
    ])
    .then(async function (res) {
      var sql = `INSERT INTO role (title,salary, department_id)
              VALUE ('${res.title}' , ${res.salary},
             (SELECT id FROM department WHERE name='${res.department}'))`;
      const [rows, fields] = await pool.query(sql);
      console.log("The new role has been added.");
      Prompt();
    });
}

// Query to add a new employee
async function addEmployee() {
  var arrChoices = await getRolesList();
  var arrManager = await getManagerList();
  return inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "What is the name?",
      },
      {
        name: "last_name",
        type: "input",
        message: "What is the last name?",
      },
      {
        name: "role",
        type: "list",
        message: "What is the role?",
        choices: arrChoices,
      },
      {
        name: "manager",
        type: "list",
        message: "What is the manager name?",
        choices: arrManager,
      },
    ])
    .then(async function (res) {
      // First get the id of the manager
      var sql = `SELECT id FROM employee WHERE first_name='${res.manager}'`;
      const [rows, fields] = await pool.query(sql);
      // Here insert al the data for the employee table, including the manager id.
      sql = `INSERT INTO employee (first_name,last_name,role_id,manager_id) 
            values ('${res.first_name}','${res.last_name}',              
            (SELECT id FROM role WHERE title='${res.role}'), '${rows[0].id}')`;
      const [rows2, fields2] = await pool.query(sql);
      console.log("New employee has been added");

      Prompt();
    });
}

//
async function updateEmployeeRole() {
  var arrChoices = await getRolesList();
  return inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "What is the name?",
      },
      {
        name: "last_name",
        type: "input",
        message: "What is the last name?",
      },
      {
        name: "role",
        type: "list",
        message: "What is the role?",
        choices: arrChoices,
      },
    ])
    .then(async function (res) {
      var glbEmpId = 0;
      // >>>> Query 1: Get the employee ID
      var sql = `SELECT id FROM employee WHERE first_name='${res.first_name}'
                AND last_name='${res.last_name}'`;
      const [rows, fields] = await pool.query(sql);
      glbEmpId = rows[0].id;
      // >>>> Query 2: Get the role ID
      sql = `SELECT id FROM role WHERE title = '${res.role}'`;
      const [rows2, fields2] = await pool.query(sql);
      // >>>> Query 3: Update the employee record
      sql = `UPDATE employee SET role_id = ${rows2[0].id} WHERE id=${glbEmpId}`;
      const [rows3, fields3] = await pool.query(sql);
      console.log("Employee role has been updated");
      Prompt();
    });
}

async function getDepartmentsList() {
  var arrResults = [];
  var sql = `select name from department`;
  const [rows, fields] = await pool.query(sql);
  for (var i = 0; i < rows.length; i++) {
    arrResults.push(rows[i].name);
  }
  return arrResults;
}

async function getRolesList() {
  var arrResults = [];
  var sql = `select title from role`;
  const [rows, fields] = await pool.query(sql);
  for (var i = 0; i < rows.length; i++) {
    arrResults.push(rows[i].title);
  }
  return arrResults;
}

async function getManagerList() {
  var arrResults = [];
  var sql = `select first_name from employee`;
  const [rows, fields] = await pool.query(sql);
  for (var i = 0; i < rows.length; i++) {
    arrResults.push(rows[i].first_name);
  }
  return arrResults;
}

Prompt();