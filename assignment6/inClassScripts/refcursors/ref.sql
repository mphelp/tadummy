declare
  type rc is ref cursor;
 
  cursor c is select * from dual;

  l_cursor rc;
begin
  if ( to_char(sysdate,'dd') = 30 ) then
    open l_cursor for 'select * from customer';
  elsif ( to_char(sysdate,'dd') = 29 ) then
    open l_cursor for select * from product;
  else
    open l_cursor for select * from dual;
  end if;
  open c;
end;
/
