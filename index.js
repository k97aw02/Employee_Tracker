const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

var connection = mysql.createConnection(
    {
        host: "localhost",
        port: 3306,
        user: "root",
        password: "James1189",
        database: "employee_cms_db"
    }
);

function validateString(answer) {
    if (answer != "" && isNaN(parseInt(answer))) {
        return true;
    }
    return false;
} 


function validateNumber(answer) {
    if (answer != "" && !isNaN(parseInt(answer))) {
        return true;
    }
    return false;
} 

function continuePrompt() {
    inquirer.prompt([
        {
            type: "confirm",
            name: "continue",
            message: "Do you wish to continue?"
        }
    ]).then(function (data) {
        if (data.continue) {
            start();
        }
        else {
            return;
        }
    });
}

function start() {
    inquirer.prompt([
        {
            type: "list",
            name: "selector",
            message: "Please make a selection:",
            choices: [
                "View All Employees",
                "View All Departments",
                "View All Roles",
                "Add Employee",
                "Add Department",
                "Add Role",                
                "Update Role"
            ]
        }
    ]).then(function (answer) {
        switch (answer.selector) {
            
            case "View All Employees":
                connection.query("SELECT * FROM employee", function (err, data) {
                    if (err) throw err;
                    console.table(data);
                    continuePrompt();
                });
                break; 
            
            case "View All Departments":
                connection.query("SELECT * FROM department", function (err, data) {
                    if (err) throw err;
                    console.table(data);
                    continuePrompt();
                });
                break; 
            
            case "View All Roles":
                connection.query("SELECT * FROM role", function (err, data) { 
                    if (err) throw err;
                    console.table(data);
                    continuePrompt();
                });
                break;
            
            case "Add Role":
                connection.query("SELECT id, department FROM department", function (err, data) {
                    if (err) throw err;
                    let choices = data.map(x => ({
                        value: x.id,
                        name: x.department
                    }))                    
                    inquirer.prompt([
                            {
                                type: "input",
                                name: "title",
                                message: "Enter the role name:",
                                validate: validateString
                            },
                            {
                                type: "input",
                                name: "salary",
                                message: "Enter a salary:",
                                validate: validateNumber
                            },
                            {
                                type: "list",
                                name: "department",
                                message: "Select the department:",
                                choices: [...choices]
                            }
                        ]).then(function (data) {
                            let deptID = 1;
                            connection.query(`INSERT INTO role (title, salary, department_id) VALUES ('${data.title}', ${data.salary}, ${deptID})`, function (err, data) {
                                if (err) throw err;
                                continuePrompt();
                            });
                        });
                    });
                    break;
                
                case "Add Employee":
                    let role_id = 1;
                    console.log(role_id);
                    connection.query("SELECT id, title FROM role", function (err, data) {
                        if (err) throw err;
                        let choices = data.map(x => ({
                            value: x.id,
                            name: x.title
                        })) 
                        inquirer.prompt([
                            {
                                type: "input",
                                name: "firstName",
                                message: "Type employee's first name:",
                                validate: validateString
                            },
                            {
                                type: "input",
                                name: "last_name",
                                message: "Type employee's last name:",
                                validate: validateString
                            },
                            {
                                type: "list",
                                name: "role",
                                message: "Select employee's role:",
                                choices: [...choices]
                            }
                        ]).then(function (data) {
                            connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${data.firstName}', '${data.last_name}', ${role_id}, 0)`, function (err, data) {
                                if (err) throw err;
                                console.log("Employee added to database")
                                continuePrompt();
                            });
                        });
                    });
                    break;
                    
                case "Add Department":
                    inquirer.prompt([
                        {
                            type: "input",
                            name: "department",
                            message: "Enter the department's name:",
                            validate: validateString
                        }
                    ]).then(function (data) {
                        connection.query(`INSERT INTO department (department) VALUES ('${data.department}');`, function (err, data) {
                            if (err) throw err;
                            return data;
                            
                        });
                        continuePrompt();
                    });
                    break;
                
                
                case "Update Employee Role":
                    const emp = {
                        first_name: "",
                        last_name: "",
                        role_id: 0,
                        manager_id: 0,
                        id: 0
                    };
                    connection.query("SELECT id, first_name, last_name FROM employee", function (err, data) {
                        if (err) throw err;
                         let choices = data.map(x => ({
                            value: x.id,
                            name: x.first_name,
                            nameLast: x.last_name
                         })) 
                        inquirer.prompt([
                            {
                                type: "list",
                                name: "employee",
                                message: "Select an employee:",
                                choices: [...choices]
                            }
                        ]).then(function (data) {
                            var arr = data.employee.split(" ");
                            emp.id = parseInt(arr[0]);
                            inquirer.prompt([
                                {
                                    type: "input",
                                    name: "firstName",
                                    message: "Enter the employee's first name:",
                                    validate: validateString
                                },
                                {
                                    type: "input",
                                    name: "last_name",
                                    message: "Enter the employee's last name:",
                                    validate: validateString
                                }
                            ]).then(function (data) {
                                emp.first_name = data.firstName;
                                emp.last_name = data.last_name;
                                connection.query("SELECT id, title FROM role", function (err, data) {
                                    if (err) throw err;
                                    let choices = data.map(x => ({
                                        value: x.id,
                                        name: x.title
                                     }) )
                                    inquirer.prompt([
                                            {
                                                type: "list",
                                                name: "title",
                                                message: "Select a title:",
                                                choices: [...choices]
                                            }
                                    ]).then(function (data) {
                                        let arr = data.role.split(" ");
                                        emp.role_id = data.role;
                                        connection.query("SELECT id, first_name, last_name FROM employee", function (err, data) {
                                            if (err) throw err;
                                            let choices = data.map(x => ({
                                                value: x.id,
                                                name: x.first_name,
                                                nameLast: x.last_name
                                            })) 
                                            inquirer.prompt([
                                                {
                                                    type: "list",
                                                    name: "manager",
                                                    message: "Select this employee's manager:",
                                                    choices: [...choices]
                                                }
                                            ]).then(function (data) {
                                                if (data.manager === "This employee does not have a manager") {
                                                    emp.manager_id = null;
                                                }
                                                else {
                                                    let arr = data.manager.split(" ");
                                                    emp.manager_id = parseInt(arr[0]);
                                                }
                                                connection.query(`UPDATE employee SET first_name = '${emp.first_name}', last_name = '${emp.last_name}', role_id = ${emp.role_id}, manager_id = ${emp.manager_id} WHERE id = ${emp.id}`, function (err, data) {
                                                    if (err) throw err;
                                                    continuePrompt();
                                                    return data;
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                    break;
            }
        });
}
start();