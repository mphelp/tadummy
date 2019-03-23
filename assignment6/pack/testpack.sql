declare
  spid salesperson.salpers_id%type := '&id';
  nm salesperson.salpers_name%type;
  val salesperson.comm%type;
begin
  nm := salepack.getspname(spid);
  val := salepack.getcomm(spid);
  if val is null then
    dbms_output.put_line('There is no commission value');
  else
    dbms_output.put_line('The commission rate for ' || nm || ' is ' || val || '%');
  end if; 
end;
/

