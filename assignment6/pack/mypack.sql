create or replace package salepack
is
  function getspname (id salesperson.salpers_id%type) 
    return salesperson.salpers_name%type;
  function getcomm (id salesperson.salpers_id%type)
    return salesperson.comm%type;
  function getcomm (name salesperson.salpers_name%type) 
    return salesperson.comm%type;
  procedure spcustrpt (sid salesperson.salpers_id%type);
end salepack;
/

