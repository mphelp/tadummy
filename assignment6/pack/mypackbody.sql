create or replace package body salepack
is
  function getspname(id salesperson.salpers_id%type)
    return salesperson.salpers_name%type
  is
    name salesperson.salpers_name%type; 
  begin
    select salpers_name
    into name
    from salesperson
    where salpers_id = id; 
    return name; 
  exception
    when no_data_found then
      dbms_output.put_line('getspname error: ' || id || ' not found');
      return null;
  end;

  function getcomm(id salesperson.salpers_id%type)
    return salesperson.comm%type
  is
    c salesperson.comm%type;
  begin
    select comm
    into c
    from salesperson
    where salpers_id = id;
    return c;
  exception
    when no_data_found then
      dbms_output.put_line('getcomm error: ' || id || ' not found');
      return null;
  end;

  function getcomm(name salesperson.salpers_name%type)
    return salesperson.comm%type
  is
    c salesperson.comm%type;
  begin
    select comm
    into c
    from salesperson
    where salpers_name = name ;
    return c;
  exception
    when no_data_found then
      dbms_output.put_line('getcomm error: ' || name || ' not found');
      return null;
  end;



  procedure spcustrpt (sid salesperson.salpers_id%type)
  is
    cursor cust_c (id salesperson.salpers_id%type) 
    is
      select distinct c.cust_name, c.country 
      from customer c, sale s
      where c.cust_id = s.cust_id
      and s.salpers_id = id;

  cname customer.cust_name%type;
  ctry customer.country%type;
  sname salesperson.salpers_name%type;
  counter binary_integer := 0;

  nothing exception;

  begin
    select salpers_name
    into sname
    from salesperson
    where salpers_id = sid;
    dbms_output.put_line('Salesperson: ' || sname);

    dbms_output.put_line('Customers:');
    open cust_c(sid);
    loop
      fetch cust_c into cname, ctry;
      exit when cust_c%notfound;
      counter := counter + 1;
      dbms_output.put('--> ' || counter || '. ' || cname);
      dbms_output.put_line(', from ' || ctry);
    end loop;
    close cust_c;
    if counter = 0 then
      raise nothing;
    end if;

  exception
    when nothing then
      dbms_output.put_line('no customers found');
    when no_data_found then
      dbms_output.put_line('no such salesperson');
  end;

end salepack;
/

