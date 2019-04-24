load data infile 'major.csv'
insert into table major
fields terminated by "," optionally enclosed by '"'
(major_id SEQUENCE, department_id, major_name)
