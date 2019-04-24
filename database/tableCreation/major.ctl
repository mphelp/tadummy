load data infile 'major.csv'
insert into table major
fields terminated by "," optionally enclosed by '"'
(department_id, major_name)
