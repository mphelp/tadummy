
create table customer
        (cust_id number(3),
        cust_name varchar2(30),
        city varchar2(25),
        country varchar2(15),
        beg_bal float,
        cur_bal float);

create table manufacturer 
        (manufactr_id number(3),
        manufactr_name varchar2(30),
        city varchar2(30),
        country varchar2(30));

create table product
        (prod_id number(4),
        prod_desc varchar2(30),
        manufactr_id number(3),
        cost float,
        price float);

create table sale
        (sale_id number(3),
        sdate date,
        cust_id number(3),
        salpers_id number(2),
        prod_id number(4),
        qty int);

create table salesperson
        (salpers_id number(2),
        salpers_name varchar2(30),
        manager_id number(2),
        office varchar2(20),
        comm float);

