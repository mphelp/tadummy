-- exrc1.sql
DECLARE
  type refcur is ref cursor;
  sp_rc refcur;
  name salesperson.salpers_name%type;
  ofc salesperson.office%type;
BEGIN
  open sp_rc for
    select salpers_name, office
    from salesperson
    where comm > 10;
  loop
    fetch sp_rc into name, ofc;
    exit when sp_rc%notfound;
    dbms_output.put_line(name || ' in ' || ofc);
  end loop;
  close sp_rc;
END;
/

