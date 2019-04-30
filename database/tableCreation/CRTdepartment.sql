drop table department cascade constraints;

create table department(
    department_id   number(3) PRIMARY KEY,
    college   varchar2(30) not null,
    abbrev varchar2(14),
    name varchar2(40)
);

drop SEQUENCE dept_seq;
create SEQUENCE dept_seq start with 1;

create or replace trigger dept_trig
    BEFORE INSERT ON department
    FOR EACH ROW
        BEGIN
            SELECT dept_seq.NEXTVAL
            INTO :new.department_id
            FROM dual;
        END;
/
