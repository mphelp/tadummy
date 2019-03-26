set verify off
set feedback off
declare
    sid salesperson.salpers_id%type := '&sid';
begin
    salepack.sp_transactions(sid);
end;
/
