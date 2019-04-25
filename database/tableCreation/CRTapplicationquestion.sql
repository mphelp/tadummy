drop table applicationquestion cascade constraints;

create table applicationquestion(
    question_id number(4) PRIMARY KEY,
    course_id number(6) not null,
    text varchar2(50),
    CONSTRAINT courseid_appq_fk
        FOREIGN KEY (course_id)
        REFERENCES course (course_id)
);

drop SEQUENCE appquestion_seq;
create SEQUENCE appquestion_seq start with 1;

create or replace trigger appquestion_trig
    BEFORE INSERT ON applicationquestion
    FOR EACH ROW
        BEGIN
            SELECT appquestion_seq.NEXTVAL
            INTO :new.question_id
            FROM dual;
        END;
/
