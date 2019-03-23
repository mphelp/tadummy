create or replace trigger salchg
after update on people
for each row
begin
  dbms_output.put_line('salary for ' || :old.name || ' changed from ');
  dbms_output.put_line(:old.salary || ' to '|| :new.salary);
end;
/
