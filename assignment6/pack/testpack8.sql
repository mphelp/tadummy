set verify off
set feedback off
-- tests getting manager name from saleperson's id
begin
  salepack.getmanager('&spid');
end;
/
