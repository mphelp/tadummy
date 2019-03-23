drop table sale;

create table sale
        (sale_id number(3) not null,
        sdate date not null,
        cust_id number(3) not null,
        salpers_id number(2) not null,
        prod_id number(4) not null,
        qty int not null);
