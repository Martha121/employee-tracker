/* WHEN I choose to view all departments
   THEN I am presented with a formatted table showing department names and department ids */
select * from department;
/*
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
*/
 SELECT role.title, role.id, department.name, role.salary 
 FROM role 
 INNER JOIN department 
 ON role.department_id = department.id;

/*WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to*/

SELECT e.id, e.first_name, e.last_name, role.title AS job_title, department.name AS departments, role.salary AS salaries, Concat(m.first_name,' ', m.last_name) AS manager
FROM employee e
LEFT JOIN employee m ON e.manager_id = m.id
LEFT JOIN role ON e.role_id=role.id
LEFT JOIN department ON role.department_id=department.id;

/*WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database*/

 INSERT INTO department (name)
 value (?);

 /*WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database*/

INSERT INTO role (title,salary, department_id)
value (?,?,?);
/*INSERT INTO role (title,salary, department_id)
value ("SUPER TITLE", 77500,(SELECT id FROM department WHERE name="Sales" ));*/

/*WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager and that employee is added to the database*/
INSERT INTO employee (first_name,last_name, role_id, manager_id)
value (?,?,?,?);

/*WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database*/

UPDATE employee
SET role_id='?'
WHERE id = '?';