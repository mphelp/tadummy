drop table customer;

create table customer
        (cust_id number(3) not null,
        cust_name varchar2(30) not null,
        city varchar2(25) null,
        country varchar2(15) null,
        beg_bal float null,
        cur_bal float null);
