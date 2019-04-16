drop table applicationanswer cascade constraints;

create table applicationanswer(
    question_id number(4) not null,
    netid varchar2(16) not null,
    text varchar2(100),
    CONSTRAINT pk_answer PRIMARY KEY (question_id, netid),
    CONSTRAINT questionid_answer_fk
        FOREIGN KEY (question_id)
        REFERENCES applicationquestion (question_id),
    CONSTRAINT netid_answer_fk
        FOREIGN KEY (netid)
        REFERENCES student (netid)
);
