drop table dorm cascade constraints;

create table dorm(
    dorm_id     number(3) PRIMARY KEY,
    dorm_name   varchar2(30)
);

drop SEQUENCE dorm_seq;
create SEQUENCE dorm_seq start with 1;

create or replace trigger dorm_trig
    BEFORE INSERT ON dorm
    FOR EACH ROW
        BEGIN
            SELECT dorm_seq.NEXTVAL
            INTO :new.dorm_id
            FROM dual;
        END;
/
