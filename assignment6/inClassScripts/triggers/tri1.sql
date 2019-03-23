create or replace trigger one
after update on people
for each row
begin
  dbms_output.put_line('table people has been updated');
end;
/
