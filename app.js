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
    connection.query("SELECT role.title, role.id, department.name, role.salary FROM role INNER JOIN department ON role.department_id = department.id",
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
        console.log (res);
     connection.query("INSERT INTO department SET name=res",
               function(err) {
                if (err) throw err
                console.table(res)
                Prompt();
            }
        )
    })
  }


Prompt();