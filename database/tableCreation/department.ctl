load data infile 'department.csv'
insert into table department
fields terminated by "," optionally enclosed by '"'
(college, name, abbrev)
