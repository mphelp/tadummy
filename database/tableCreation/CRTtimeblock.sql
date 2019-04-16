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
