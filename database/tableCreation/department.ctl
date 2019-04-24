load data infile 'department.csv'
insert into table department
fields terminated by "," optionally enclosed by '"'
(department_id SEQUENCE, college, name, abbrev)
