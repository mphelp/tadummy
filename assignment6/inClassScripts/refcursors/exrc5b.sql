-- exrc5b.sql
DECLARE
  type refcur is ref cursor;
  sp_rc refcur;
  type sp_record_type is record
  (
    name salesperson.salpers_name%type,
    ofc salesperson.office%type
  );
--
  procedure showsubs(x refcur) is
    sp_rcrd sp_record_type;
  begin
    loop
      fetch x into sp_rcrd;
      exit when sp_rc%notfound;
      dbms_output.put_line(chr(9) || sp_rcrd.name || ', ' || sp_rcrd.ofc);
   end loop;
  end;
  
BEGIN
 for sp in (select salpers_id, salpers_name from salesperson)
 loop
   open sp_rc for
     select salpers_name, office
     from salesperson
     where sp.salpers_id = manager_id;
   dbms_output.put_line(sp.salpers_name);
   showsubs(sp_rc);
   close sp_rc;
 end loop;
END;
/

