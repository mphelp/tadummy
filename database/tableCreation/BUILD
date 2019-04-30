USER=admin
PASS=tadummysecret

sqlplus $USER/$PASS @CRTall

sqlldr $USER/$PASS control=users.ctl
sqlldr $USER/$PASS control=dorm.ctl
sqlldr $USER/$PASS control=department.ctl
sqlldr $USER/$PASS control=major.ctl
sqlldr $USER/$PASS control=semester.ctl
sqlldr $USER/$PASS control=availability.ctl
sqlldr $USER/$PASS control=student.ctl

#sqlplus $USER/$PASS @insmock/INSall
