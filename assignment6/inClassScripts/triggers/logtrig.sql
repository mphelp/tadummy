create or replace trigger updatemylogtrig
after update of salary on people
referencing old as prevtbl new as newtbl
for each row
begin
  insert into mylog
  values(:prevtbl.name, :prevtbl.salary, :newtbl.salary, sysdate);
end;
/
