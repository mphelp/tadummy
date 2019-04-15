drop table student cascade constraints;

create table student(
    netid   varchar2(16) PRIMARY KEY,
    major   number(3),
    dorm    number(3),
    CONSTRAINT maj_fk
        FOREIGN KEY (major)
        REFERENCES major (major_id),
    CONSTRAINT dorm_fk
        FOREIGN KEY (dorm)
        REFERENCES dorm (dorm_id)
);
