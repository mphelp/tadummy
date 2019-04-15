drop table major cascade constraints;

create table major(
    major_id number(3) PRIMARY KEY,
    department_id number(3),
    major_name varchar2(30),
    CONSTRAINT dept_fk
        FOREIGN KEY (department_id)
        REFERENCES department (department_id)
);
