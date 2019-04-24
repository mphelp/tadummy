USER=admin
PASS=tadummysecret

sqlplus $USER/$PASS

prompt ***** CREATING TABLES *****
@CRTall

prompt ***** ENTERING ADMIN USERS *****
@INSusers

exit

sqlldr $USER/$PASS control=dorm.ctl
sqlldr $USER/$PASS control=department.ctl
sqlldr $USER/$PASS control=major.ctl

