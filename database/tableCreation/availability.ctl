load data infile 'availability.csv'
insert into table availability
fields terminated by "," optionally enclosed by '"'
(avail_desc)
