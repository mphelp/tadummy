drop table availability cascade constraints;

create table availability(
    avail_id number(3) PRIMARY KEY,
    avail_desc varchar2(30)
);

drop SEQUENCE avail_seq;
create SEQUENCE avail_seq start with 1;

create or replace trigger avail_trig
    BEFORE INSERT ON availability
    FOR EACH ROW
        BEGIN
            SELECT avail_seq.NEXTVAL
            INTO :new.avail_id
            FROM dual;
        END;
/
