drop table professor cascade constraints;

create table professor(
    netid varchar2(16) PRIMARY KEY,
    office varchar2(100),
    department_id number(3),
    CONSTRAINT dept_fk
        FOREIGN KEY (department_id)
        REFERENCES department (department_id)
);
