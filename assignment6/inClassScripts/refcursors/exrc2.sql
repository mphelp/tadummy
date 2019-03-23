-- exrc2.sql
DECLARE
  type refcur is ref cursor;
  sp_rc refcur;
  sp_row salesperson%rowtype;
BEGIN
  open sp_rc for
    select *
    from salesperson
    where comm > 10;
  loop
    fetch sp_rc into sp_row;
    exit when sp_rc%notfound;
    dbms_output.put_line(sp_row.salpers_name || ' in ' || sp_row.office);
  end loop;
  close sp_rc;
END;
/

