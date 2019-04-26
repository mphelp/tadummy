load data infile 'users.csv'
insert into table users
fields terminated by "," optionally enclosed by '"'
(netid, name, admin CONSTANT 1)
