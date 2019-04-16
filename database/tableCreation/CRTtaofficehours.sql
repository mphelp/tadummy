drop table taofficehours cascade constraints;

create table taofficehours(
    timeblock_id number(4) not null,
    netid varchar2(16) not null,
    course_id number(6) not null,
    CONSTRAINT pk_toh PRIMARY KEY (timeblock_id, netid, course_id),
    CONSTRAINT timeblockid_toh_fk
        FOREIGN KEY (timeblock_id)
        REFERENCES timeblock (timeblock_id),
    CONSTRAINT netid_toh_fk
        FOREIGN KEY (netid)
        REFERENCES student (netid),
    CONSTRAINT courseid_toh_fk
        FOREIGN KEY (course_id)
        REFERENCES course (course_id)
);
