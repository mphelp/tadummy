insert into users (netid, name, admin) values ('pbui', 'Peter Bui', 0);
insert into professor (netid, office, department_id) values ('pbui', '350 Fitzpatrick Hall Of Engineering$Notre Dame, IN 46556', 1);

insert into users (netid, name, admin) values ('skumar5', 'Shreya Kumar', 0);
insert into professor (netid, office, department_id) values ('skumar5', '378 Fitzpatrick Hall Of Engineering$Notre Dame, IN 46556', 1);

insert into users (netid, name, admin) values ('jbb', 'Jay Brockman', 0);
insert into professor (netid, office, department_id) values ('jbb', '211A Cushing Hall of Engineering$Notre Dame, IN 46556', 1);


insert into proffor(netid, course_id, avail_id, status) values ('pbui', 2, 2, 'In class');
insert into proffor(netid, course_id, avail_id, status) values ('pbui', 3, 3, '');
insert into proffor(netid, course_id, avail_id, status) values ('pbui', 5, 3, '');
insert into proffor(netid, course_id, avail_id, status) values ('skumar5', 4, 1, 'In my office');
insert into proffor(netid, course_id, avail_id, status) values ('jbb', 1, 2, 'At lunch');



insert into profofficehours (timeblock_id, netid, course_id) values (10, 'pbui', 2);
insert into profofficehours (timeblock_id, netid, course_id) values (11, 'skumar5', 4);
insert into profofficehours (timeblock_id, netid, course_id) values (12, 'jbb', 1);
