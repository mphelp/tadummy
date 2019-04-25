drop table semester cascade constraints;

create table semester(
    semester_id number(2) PRIMARY KEY,
    startDate timestamp,
    endDate timestamp
);

drop SEQUENCE semester_seq;
create SEQUENCE semester_seq start with 1;

create or replace trigger semester_trig
    BEFORE INSERT ON semester
    FOR EACH ROW
        BEGIN
            SELECT semester_seq.NEXTVAL
            INTO :new.semester_id
            FROM dual;
        END;
/
