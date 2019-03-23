-- exrc3.sql
DECLARE
  type refcur is ref cursor;
  sp_rc refcur;
  type sp_record_type is record
  (
    name salesperson.salpers_name%type,
    ofc salesperson.office%type
  );
  sp_rcrd sp_record_type;
  
BEGIN
  open sp_rc for
    select salpers_name, office
    from salesperson
    where comm > 10;
  loop
    fetch sp_rc into sp_rcrd;
    exit when sp_rc%notfound;
    dbms_output.put_line(sp_rcrd.name || ' in ' || sp_rcrd.ofc);
  end loop;
  close sp_rc;
END;
/

