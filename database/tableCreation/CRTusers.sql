drop table users cascade constraints;

create table users(
    netid   varchar2(16) PRIMARY KEY,
    name   varchar2(60) not null,
    admin number(1) default 0,
    dateJoined DATE default SYSDATE not null
);
