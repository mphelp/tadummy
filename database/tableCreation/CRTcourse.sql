drop table course cascade constraints;

create table course(
    course_id number(6) PRIMARY KEY,
    course_name varchar2(30),
    semester_id number(3),
    CONSTRAINT semester_id_fk
        FOREIGN KEY (semester_id)
        REFERENCES semester (semester_id)
);

drop SEQUENCE course_seq;
create SEQUENCE course_seq start with 1;

create or replace trigger course_trig
    BEFORE INSERT ON course
    FOR EACH ROW
        BEGIN
            SELECT course_seq.NEXTVAL
            INTO :new.course_id
            FROM dual;
        END;
/
