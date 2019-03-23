-- exrc4b.sql
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
 for sp in (select salpers_id, salpers_name from salesperson)
 loop
   open sp_rc for
     select salpers_name, office
     from salesperson
     where sp.salpers_id = manager_id;
   dbms_output.put_line(sp.salpers_name);
   fetch sp_rc into sp_rcrd;
   if (sp_rc%notfound) then
    dbms_output.put_line(chr(9) || 'none');
    continue;
   end if;
   loop
     dbms_output.put_line(chr(9) || sp_rcrd.name || ', ' || sp_rcrd.ofc);
     fetch sp_rc into sp_rcrd;
     exit when sp_rc%notfound;
   end loop;
   close sp_rc;
 end loop;
END;
/

