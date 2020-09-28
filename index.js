const mysql = require("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection(
    {
        host: "localhost",
        port: 3306,
        user: "root",
        password: "James1189",
        database: "employee_cms_db"
    }
);
// An expected string cannot be a number
function validateString(answer) {
    if (answer != "" && isNaN(parseInt(answer))) {
        return true;
    }
    return false;
} 

// An expected number cannot be a string nor include redundant commas
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
            message: "Do you want to continue?"
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

// User is presented with prompts when application is started
function start() {
    inquirer.prompt([
        {
            type: "list",
            name: "mainMenu",
            message: "Select an option:",
            choices: [
                "Add A Department",
                "Add A Role",
                "Add An Employee",
                "View All Departments",
                "View All Roles",
                "View All Employees",  
                "Update Role"
            ]
        }
    ]).then(function (answer) {
        switch (answer.mainMenu) {
            // View All Employees Option
            case "View All Employees":
                connection.query("SELECT * FROM employee", function (err, data) {
                    if (err) throw err;
                    console.table(data);
                    continuePrompt();
                });
                break; 
            // View All Departments Option
            case "View All Departments":
                connection.query("SELECT * FROM department", function (err, data) {
                    if (err) throw err;
                    console.table(data);
                    continuePrompt();
                });
                break; 
            // View All Roles Option
            case "View All Roles":
                connection.query("SELECT * FROM jobTitle", function (err, data) {
                    if (err) throw err;
                    console.table(data);
                    continuePrompt();
                });
                break;
            // Add A Role Option
            case "Add A Role":
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
                            connection.query(`INSERT INTO jobTitle (title, salary, department_id) VALUES ('${data.title}', ${data.salary}, ${deptID})`, function (err, data) {
                                if (err) throw err;
                                continuePrompt();
                            });
                        });
                    });
                    break;
                // Add an Employee Option
                case "Add An Employee":
                    let role_no = 1;
                    console.log(role_no);
                    connection.query("SELECT id, title FROM jobTitle", function (err, data) {
                        if (err) throw err;
                        let choices = data.map(x => ({
                            value: x.id,
                            name: x.title
                        })) 
                        inquirer.prompt([
                            {
                                type: "input",
                                name: "firstName",
                                message: "Enter this employee's first name:",
                                validate: validateString
                            },
                            {
                                type: "input",
                                name: "lastName",
                                message: "Enter this employee's last name:",
                                validate: validateString
                            },
                            {
                                type: "list",
                                name: "role",
                                message: "Select this employee's role:",
                                choices: [...choices]
                            }
                        ]).then(function (data) {
                            connection.query(`INSERT INTO employee (firstname, lastname, role_no, manager_id) VALUES ('${data.firstName}', '${data.lastName}', ${role_no}, 0)`, function (err, data) {
                                if (err) throw err;
                                console.log("Employee has been added to the table!")
                                continuePrompt();
                            });
                        });
                    });
                    break;
                    // Add A Department Option (This must be selected first)
                case "Add A Department":
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
                
                // Update An Employee Option
                case "Update Employee Role":
                    const emp = {
                        firstname: "",
                        lastname: "",
                        role_no: 0,
                        manager_id: 0,
                        empID: 0
                    };
                    connection.query("SELECT id, firstname, lastname FROM employee", function (err, data) {
                        if (err) throw err;
                         let choices = data.map(x => ({
                            value: x.id,
                            name: x.firstname,
                            nameLast: x.lastname
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
                            emp.empID = parseInt(arr[0]);
                            inquirer.prompt([
                                {
                                    type: "input",
                                    name: "firstName",
                                    message: "Enter the employee's first name:",
                                    validate: validateString
                                },
                                {
                                    type: "input",
                                    name: "lastName",
                                    message: "Enter the employee's last name:",
                                    validate: validateString
                                }
                            ]).then(function (data) {
                                emp.firstname = data.firstName;
                                emp.lastname = data.lastName;
                                connection.query("SELECT id, title FROM jobTitle", function (err, data) {
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
                                        let arr = data.jobTitle.split(" ");
                                        emp.role_no = data.jobTitle;
                                        connection.query("SELECT id, firstname, lastname FROM employee", function (err, data) {
                                            if (err) throw err;
                                            let choices = data.map(x => ({
                                                value: x.id,
                                                name: x.firstname,
                                                nameLast: x.lastname
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
                                                connection.query(`UPDATE employee SET firstname = '${emp.firstname}', lastname = '${emp.lastname}', role_no = ${emp.role_no}, manager_id = ${emp.manager_id} WHERE id = ${emp.empID}`, function (err, data) {
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