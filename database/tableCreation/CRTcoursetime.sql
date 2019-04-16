drop table coursetime cascade constraints;

create table coursetime(
    course_id number(6) not null,
    timeblock_id number(4) not null,
    CONSTRAINT pk_coursetime PRIMARY KEY (course_id, timeblock_id),
    CONSTRAINT course_time_fk
        FOREIGN KEY (course_id)
        REFERENCES course (course_id),
    CONSTRAINT timeblock_coursetime_fk
        FOREIGN KEY (timeblock_id)
        REFERENCES timeblock (timeblock_id)
);
