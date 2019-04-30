insert into users (netid, name, admin) values ('pbui', 'Peter Bui', 0);

insert into professor (netid, office, department_id) values ('pbui', '350 Fitzpatrick Hall Of Engineering$Notre Dame, IN 46556', 1);
insert into proffor(netid, course_id, avail_id, status) values ('pbui', 2, 3, 'In class');
insert into profofficehours (timeblock_id, netid, course_id) values (4, 'pbui', 2);

