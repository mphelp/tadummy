insert into customer
values(100,'Watabe Bros','Tokyo','Japan',45551,52113)
;
insert into customer
values(101,'Maltzl','Salzburg','Austria',75314,77200)
;
insert into customer
values(105,'Jefferson','Chicago','USA',49333,57811)
;
insert into customer
values(110,'Gomez','Santiago','Chile',27400,35414)
;
insert into manufacturer
values(210,'Kiwi Klothes','Auckland','New Zealand')
;
insert into manufacturer
values(253,'Brass Works','Lagos','Nigeria')
;
insert into manufacturer
values(317,'Llama Lamps','Lima','Peru')
;
insert into product
values(1035,'Sweater',210,11.25,22.00)
;
insert into product
values(2241,'Table Lamp',317,22.25,33.25)
;
insert into product
values(2249,'Desk Lamp',317,13.55,24.80)
;
insert into product
values(2518,'Brass Sculpture',253,13.60,21.20)
;
ALTER SESSION
SET NLS_DATE_FORMAT = 'MM/DD';

insert into sale
values(01,'02/28',100,10,2241,200)
;
insert into sale
values(02,'02/12',101,23,2518,300)
;
insert into sale
values(03,'02/15',101,23,1035,150)
;
insert into sale
values(04,'02/19',100,39,2518,200)
;
insert into sale
values(05,'02/02',101,23,1035,200)
;
insert into sale
values(06,'02/05',105,10,2241,100)
;
insert into sale
values(07,'02/22',110,37,2518,150)
;
insert into sale
values(08,'02/14',105,10,2249,50)
;
insert into sale
values(09,'02/01',101,23,2249,75)
;
insert into sale
values(10,'02/04',101,23,2241,250)
;
insert into salesperson
values(10,'Rodney Jones',27,'Chicago',10)
;
insert into salesperson
values(14,'Masaji Matsu',44,'Tokyo',11)
;
insert into salesperson
values(23,'Francois Moire',35,'Brussels',9)
;
insert into salesperson
values(37,'Elena Hermana',12,'B.A.',13)
;
insert into salesperson
values(39,'Goro Azuma',44,'Tokyo',10)
;
insert into salesperson
values(27,'Terry Cardon','','Chicago',15)
;
insert into salesperson
values(44,'Albert Ige',27,'Tokyo',12)
;
insert into salesperson
values(35,'Brigit Bovary',27,'Brussels',11)
;
insert into salesperson
values(12,'Buster Sanchez',27,'B.A.',10)
;
