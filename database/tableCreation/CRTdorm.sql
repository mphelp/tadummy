drop table dorm cascade constraints;

create or replace sequence seq_dorm
    MINVALUE 1
    START WITH 1
    INCREMENT BY 1
    CACHE 10;

create table dorm(
    dorm_id     number(3) PRIMARY KEY DEFAULT seq.dorm.nextval not null,
    dorm_name   varchar2(30),
);
