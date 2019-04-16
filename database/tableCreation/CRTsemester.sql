drop table semester cascade constraints;

create table semester(
    semester_id number(2) PRIMARY KEY,
    startDate timestamp,
    endDate timestamp
);
