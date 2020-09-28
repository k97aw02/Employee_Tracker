create database employee_cms_db;
use employee_cms_db;

CREATE TABLE employee (
  id int AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30) not null,
  last_name VARCHAR(30) not null,
  role_id INT not null,
  manager_id INT not null,
  PRIMARY KEY(id)
);
create table department (
id INT auto_increment not null,
name VARCHAR(30) not null,
PRIMARY KEY(id)
);
create table role ( 
id int AUTO_INCREMENT NOT NULL,
title VARCHAR(30) not null,
salary DECIMAL,
department_id INT not null,
PRIMARY KEY(id)
);

insert into employee (first_name, last_name, role_id, manager)
values('Jeff', 'C', 1, 1)