drop table department cascade constraints;

create table department(
    department_id   number(3) PRIMARY KEY,
    college   varchar2(30) not null,
    abbrev varchar2(14),
    name varchar2(40)
);
