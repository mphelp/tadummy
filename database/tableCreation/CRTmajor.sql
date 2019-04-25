drop table major cascade constraints;

create table major(
    major_id number(3) PRIMARY KEY,
    department_id number(3),
    major_name varchar2(30),
    CONSTRAINT dept_maj_fk
        FOREIGN KEY (department_id)
        REFERENCES department (department_id)
);

drop SEQUENCE major_seq;
create SEQUENCE major_seq start with 1;

create or replace trigger major_trig
    BEFORE INSERT ON major
    FOR EACH ROW
        BEGIN
            SELECT major_seq.NEXTVAL
            INTO :new.major_id
            FROM dual;
        END;
/
