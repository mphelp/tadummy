create or replace package salepack
is
    -- made by ramzi
    function getspname (id salesperson.salpers_id%type)
        return salesperson.salpers_name%type;
    function getcomm (id salesperson.salpers_id%type)
        return salesperson.comm%type;
    function getcomm (name salesperson.salpers_name%type)
        return salesperson.comm%type;
    procedure spcustrpt (sid salesperson.salpers_id%type);

    -- for Edward to finish

    --function get_sp_comm(id salesperson.salpers_id%type)
    --    return salesperson.comm%type;

    --function get_sp_comm(name salesperson.salpers_id%type)
    --    return salesperson.comm%type;


    procedure cust_transactions(cid customer.cust_id%type);

    -- for Patrick to finish

    function getcname(id customer.cust_id%type)
        return customer.cust_name%type;
    function getcid(name customer.cust_name%type)
        return customer.cust_id%type;
    function getproddesc(id product.prod_id%type)
        return product.prod_desc%type;
    function getprodcost(id product.prod_id%type)
        return product.prod_desc%type;
    function getprodprice(id product.prod_id%type)
        return product.prod_desc%type;
    -- for Matt to finish

end salepack;
/
