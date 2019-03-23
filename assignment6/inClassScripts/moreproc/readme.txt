
the file spcproc.sql contains a procedure named spcustrpt, which is
more elaborate than the other procedures we've seen.

to run the procedure:
 - either put invoke it from inside a pls/sql block:
      begin
        spcustrpt(10);  -- or spcustrpt(&num); 
      end;
      /

 - or run it directly with exec:
      exec spcustrpt(10);


