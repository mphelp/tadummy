drop table major;

create table major(
    major_id number(3) PRIMARY KEY,
    department_id number(3) FOREIGN KEY REFERENCES department(department_id)
    major_name varchar2(30)
);
