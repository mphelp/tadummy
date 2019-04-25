drop table timegroup cascade constraints;

create table timegroup(
    timegroup_id     number(4) PRIMARY KEY
);

drop SEQUENCE timegroup_seq;
create SEQUENCE timegroup_seq start with 1;

create or replace trigger timegroup_trig
    BEFORE INSERT ON timegroup
    FOR EACH ROW
        BEGIN
            SELECT timegroup_seq.NEXTVAL
            INTO :new.timegroup_id
            FROM dual;
        END;
/
