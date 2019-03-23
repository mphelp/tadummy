drop table product;

create table product
        (prod_id number(4) not null,
        prod_desc varchar2(30) not null,
        manufactr_id number(3) null,
        cost float null,
        price float null);
