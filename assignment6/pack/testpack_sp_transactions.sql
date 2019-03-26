set verify off
set feedback off
declare
    spid salesperson.salpers_id%type := '&spid';
begin
    salepack.sp_transactions(spid);
end;
/
