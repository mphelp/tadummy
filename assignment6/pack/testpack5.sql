set verify off
set feedback off
declare
    cid customer.cust_id%type := '&id';
    nm customer.cust_name%type;
begin
    nm := salepack.getcname(cid);
    if nm is null then
      dbms_output.put_line('There is no customer with that id');
    else
      dbms_output.put_line(nm);
    end if;
end;
/
