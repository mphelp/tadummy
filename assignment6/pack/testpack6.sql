set verify off
set feedback off
--tests getcid which gets customer's id from their name
declare
    nm customer.cust_name%type := '&name';
    id customer.cust_id%type;
begin
    id := salepack.getcid(nm);
    if id is null then
      dbms_output.put_line('There is no customer with that name');
    else
      dbms_output.put_line(id);
    end if;
end;
/
