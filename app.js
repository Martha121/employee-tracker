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
                // Call function to handle this option
                viewAllDepartments();
            } else
            if (options == 'View all roles'){
                //Call fucntion to handle this option
                viewAllRoles();
            }
        });
}
/*
// call once somewhere in the beginning of the app
const cTable = require('console.table');
console.table([
  {
    name: 'foo',
    age: 10
  }, {
    name: 'bar',
    age: 20
  }
]);
*/
function viewAllDepartments(){
    // Use query to bring the list of all departments
    connection.query("SELECT * FROM department",
    function(err, results, fields) {
        var arrToDisplay = [];
        //console.log(results);
        for(var i=0; i<results.length; i++){
            arrToDisplay.push(results[i].name);
        }
        console.table(results); // results contains rows returned by server
        //console.log(fields); // fields contains extra meta data about results, if available
      });
}

function viewAllRoles(){
    // Use query to bring the list of all departments
    connection.query("SELECT * FROM department",
    function(err, results, fields) {
        var arrToDisplay = [];
        //console.log(results);
        for(var i=0; i<results.length; i++){
            arrToDisplay.push(results[i].name);
        }
        console.table(results); // results contains rows returned by server
        //console.log(fields); // fields contains extra meta data about results, if available
      }); 
}

Prompt();