const inquirer = require('inquirer');
//get the client
const mysql = require('mysql2');
const { connectableObservableDescriptor } = require('rxjs/internal/observable/ConnectableObservable');

//create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Mysql123!',
    database: 'business_tracker'
  });

function Prompt(){
    return inquirer
        .prompt([
        {
            type: 'list',
            name: 'options',
            message: 'What would you like to do? (Check all that apply)',
            choices: ['View all departments',
                    'View all roles',
                    'View all employees', 
                    'Add a department', 
                    'Add a role', 
                    'Add an employee', 
                    'Update an employee role']
        }])
        .then(({options}) => {
            if(options == 'View all departments'){
                // Call function to handle All departments option
                viewAllDepartments();
            } else
            if (options == 'View all roles'){
                //Call function to handle View all roles option
                viewAllRoles();
            } else
            if(options == 'View all employees'){
                //Call function to handle View all employees option
                wiewAllEmployees();
            } else
            if (options == 'Add a department'){
               //Call function to handle Add a department option 
               addDepartment();
            } else
            if (options == 'Add a role'){
               //Call function to handle Add a department option 
               addRole();
            }

            if (options == 'Add an employee'){
                //Call function to handle Add a department option 
                addEmployee();
             }
            if (options == 'Update an employee role'){
            //Call function to handle Add a department option 
            updateEmployeeRole();
            }
        });
}

function viewAllDepartments(){
    // Use query to bring the list of all departments
    connection.query("SELECT * FROM department",
    function(err, results, fields) {
        if (err) throw err
        console.table(results) 
        Prompt()

      });
}

function viewAllRoles(){
    // Use query to bring the list of all departments
    connection.query("SELECT role.title, role.id AS role_id, department.name AS Department, role.salary "+
    "FROM role INNER JOIN department ON role.department_id = department.id ORDER BY role_id",
    function(err, results, fields){
    if (err) throw err
    console.table(results)
    Prompt() 

    }); 
}

function wiewAllEmployees(){
    var strQuery = "SELECT e.id, e.first_name, e.last_name, role.title AS job_title, department.name AS departmentes, role.salary AS salaries, Concat(m.first_name,' ', m.last_name) AS manager " +
        "FROM employee e " +
        "LEFT JOIN employee m ON e.manager_id = m.id " +
        "LEFT JOIN role ON e.role_id=role.id " +
        "LEFT JOIN department ON role.department_id=department.id";
    connection.query(strQuery,
    function(err, results, fields){
        if (err) throw err
        console.table(results)
        Prompt()


    });
}
function addDepartment(){
    return inquirer
    .prompt([
        {
          name: "name",
          type: "input",
          message: "What Department would you like to add?"
        }
    ]).then(function (res) {
        var strQuery = `INSERT INTO department (name) value ('${res.name}');`;
        connection.query(strQuery,
               function(err, results, fields) {
                if (err) throw err
                console.log("The new department has been added.");
                Prompt();
            }
        )
    })
  }

  function addRole(){
      var arrChoices = getDepartmentsList();
    return inquirer
    .prompt([
        {
          name: "title",
          type: "input",
          message: "What is the title you want to add?"
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary?"
          },
          {
            name: "department",
            type: "list",
            message: "What is the department?",
            choices: arrChoices
          }
    ]).then(function (res) {
       var sql = `INSERT INTO role (title,salary, department_id)
              VALUE ('${res.title}' , ${res.salary},
             (SELECT id FROM department WHERE name='${res.department}'))`;
        
        
        connection.query(sql,
               function(err, results, fields) {
                if (err){
                    throw err;
                    //res.status(400).json({ error: err.message });
                    //console.log("Unable to add new role. Please check your information");
                }else{
                    console.log("The new role has been added.");
                }
                
                Prompt();
            }
        )
    })
}

function addEmployee(){
    var arrChoices = getRolesList();
    var arrManager = getManagerList();
    console.log(arrManager);
    return inquirer
    .prompt([
        {
          name: "first_name",
          type: "input",
          message: "What is the name?"
        },
        {
            name: "last_name",
            type: "input",
            message: "What is the last name?"
          },
          {
            name: "role",
            type: "list",
            message: "What is the role?",
            choices: arrChoices
          },
          {
            name: "manager",
            type: "list",
            message: "What is the manager name?",
            choices: arrManager
          }
    ]).then(function (res) {
        // First get the id of the manager
        console.log(">>>>> 1");
        var mgrId = getIdManager(res.manager);
        console.log(">>>>> 2 " + mgrId);
        var sql = `INSERT INTO employee (first_name,last_name,role_id,manager_id) 
            values ('${res.first_name}','${res.last_name}',
            (SELECT id FROM role WHERE title='${res.role}'),
            '${mgrId}')`;
        console.log(">>>>> 3");
        console.log(sql);
        console.log(">>>>> 4");
        connection.query(sql,
            function(err, results, fields) {
                if (err) throw err
                console.log(">>>>> 5");
                console.log("New employee has been added");
                Prompt();
            }
        )
    })
}

function updateEmployeeRole(){
    return inquirer
    .prompt([
        {
          name: "title",
          type: "input",
          message: "What is the title you want to add?"
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary?"
          },
          {
            name: "department",
            type: "input",
            message: "What is the department?"
          }
    ]).then(function (res) {
        //var sql = "INSERT INTO role (title,salary, department_id) " + 
        //    "value ('" + res.title + "' , " +
        //    res.salary + "," + res.department_id + ")";
        var sql = "INSERT INTO role (title,salary, department_id) " +
            "value ('" + res.title + "' , " + res.salary + ", " +
            "(SELECT id FROM department WHERE name='" + res.department + "' ));";
        console.log(sql);
        connection.query(sql,
               function(err, results, fields) {
                if (err){
                    //throw err;
                    //res.status(400).json({ error: err.message });
                    console.log("Unable to add new role. Please check your information");
                }else{
                    console.log("The new role has been added.");
                }
                
                Prompt();
            }
        )
    })
}

function getDepartmentsList(){
        var arrResults = []
        var sql = `select name from department`;
        connection.query(sql,
               function(err, results, fields) {
                if (err) throw err
                
                for(var i=0; i<results.length;i++){
                    arrResults.push(results[i].name);
                }
            }
        ) 
        return arrResults;   
}

function getRolesList(){
        var arrResults = []
        var sql = `select title from role`;
        connection.query(sql,
               function(err, results, fields) {
                if (err) throw err
                
                for(var i=0; i<results.length;i++){
                    arrResults.push(results[i].title);
                }
            }
        ) 
        return arrResults;   
}

function getManagerList(){
        var arrResults = []
        var sql = `select first_name from employee`;
        connection.query(sql,
               function(err, results, fields) {
                if (err) throw err
                
                for(var i=0; i<results.length;i++){
                    arrResults.push(results[i].first_name);
                }
            }
        ) 
        return arrResults;   
}

async function getIdManager(manager){
    console.log(">>>>> A");
    var sql = `SELECT id FROM employee WHERE first_name='Virgina'`;//${manager}'`;
    console.log(">>>>> B");
    console.log(sql);
    var idManager=0;
  
    const result = connection.query(sql,
            function(err, results) {
            if (err) throw err;
            console.log(">>>>> C");
            idManager = results[0].id;
            console.log(results);
            console.log("Found a manager" + results[0].id);
            return idManager;
        }
    )
}

Prompt();