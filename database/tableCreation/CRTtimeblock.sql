drop table timeblock cascade constraints;

create table timeblock(
    timeblock_id number(4) PRIMARY KEY,
    location varchar2(20),
    startTime timestamp,
    endTime timestamp,
    timegroup_id number(4),
    CONSTRAINT timegroup_fk
        FOREIGN KEY (timegroup_id)
        REFERENCES timegroup (timegroup_id)
);

drop SEQUENCE timeblock_seq;
create SEQUENCE timeblock_seq start with 1;

create or replace trigger timeblock_trig
    BEFORE INSERT ON timeblock
    FOR EACH ROW
        BEGIN
            SELECT timeblock_seq.NEXTVAL
            INTO :new.timeblock_id
            FROM dual;
        END;
/
