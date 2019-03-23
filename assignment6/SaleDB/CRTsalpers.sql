drop table salesperson;

create table salesperson
        (salpers_id number(2) not null,
        salpers_name varchar2(30) not null,
        manager_id number(2) null,
        office varchar2(20) null,
        comm float null);
