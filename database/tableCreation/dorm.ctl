load data infile 'dorm.csv'
insert into table dorm
fields terminated by "," optionally enclosed by '"'
(dorm_name)
