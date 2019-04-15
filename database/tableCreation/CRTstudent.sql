drop table student;

create table student(
    netid   varchar2(16) PRIMARY KEY,
    major   number(3) FOREIGN KEY REFERENCES major(major_id),
    dorm    number(3) FOREIGN KEY REFERENCES dorm(dorm_id)
);
