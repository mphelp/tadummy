insert into tafor(netid, course_id, avail_id, status) values('mphelps3', 2, 1, 'I am in a gray hoodie in Lafun.');
insert into tafor(netid, course_id, avail_id, status) values('pfalvey', 1, 2, 'I am busy until 4pm');

insert into taofficehours (timeblock_id, netid, course_id) values (1, 'mphelps3', 2);
insert into taofficehours (timeblock_id, netid, course_id) values (2, 'mphelps3',  2);
insert into taofficehours (timeblock_id, netid, course_id) values (3, 'mphelps3', 2);

insert into taofficehours (timeblock_id, netid, course_id) values (4, 'pfalvey', 1);
insert into taofficehours (timeblock_id, netid, course_id) values (5, 'pfalvey', 1);
