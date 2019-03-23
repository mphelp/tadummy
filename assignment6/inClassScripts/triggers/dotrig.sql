create or replace trigger casc
before delete on names
for each row
begin
  delete people
  where name = :old.name;
end;
/

