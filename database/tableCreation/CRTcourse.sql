drop table course cascade constraints;

create table course(
    course_id number(6) PRIMARY KEY,
    course_name varchar2(30),
    semester_id number(3),
    CONSTRAINT semester_id_fk
        FOREIGN KEY (semester_id)
        REFERENCES semester (semester_id)
);
