declare
 rc sys_refcursor;
 x customer.cust_name%type;
begin
 rc := getcustsbyspid(10);
 loop
  fetch rc into x;
  exit when rc%notfound;
  dbms_output.put_line(x);
 end loop;
end;
/
