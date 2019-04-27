load data infile 'semester.csv'
insert into table semester
fields terminated by "," optionally enclosed by '"'
(startdate TIMESTAMP "mm-dd-yyyy", enddate TIMESTAMP "mm-dd-yyyy")
