load data infile 'student.csv'
insert into table student
fields terminated by "," optionally enclosed by '"'
(netid, major, dorm)
