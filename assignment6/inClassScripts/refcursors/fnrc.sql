-- funcrc.sql
create or replace function getcustsbyspid(spid salesperson.salpers_id%type) 
return sys_refcursor
is
  custs_rc sys_refcursor;
BEGIN
  open custs_rc for
    select distinct c.cust_name 
    from salesperson sp, sale s, customer c
    where sp.salpers_id = s.salpers_id 
    and s.cust_id = c.cust_id
    and sp.salpers_id = spid;
  return custs_rc;
END;
/

