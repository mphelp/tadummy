set verify off
set feedback off
declare
    cid customer.cust_id%type := '&id';
begin
    salepack.cust_transactions(cid);
end;
/

