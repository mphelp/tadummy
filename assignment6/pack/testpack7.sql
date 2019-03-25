set verify off
set feedback off
--tests getproddesc
declare
    pid product.prod_id%type := '&id';
    dsc product.prod_desc%type;
    cost product.cost%type;
    price product.price%type;
begin
    dsc := salepack.getproddesc(pid);
    if dsc is null then
      dbms_output.put_line('There is no product with that id');
    else
      dbms_output.put_line('Description: ' || dsc);
    end if;

    cost := salepack.getprodcost(pid);
    if cost is null then
      dbms_output.put_line('There is no product with that id');
    else
      dbms_output.put_line('Cost: ' || cost);
    end if;

    price := salepack.getprodprice(pid);
    if price is null then
      dbms_output.put_line('There is no product with that id');
    else
      dbms_output.put_line('Price: ' || price);
    end if;
end;
/
