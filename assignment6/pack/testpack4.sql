set verify off
set feedback off
--to test getting a salesperon's customer list

declare
    spid salesperson.salpers_id%type := '&id';
begin
    salepack.spcustrpt(spid);
end;
/
