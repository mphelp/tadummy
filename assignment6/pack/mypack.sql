create or replace package salepack
is
    function getspname (id salesperson.salpers_id%type)
        return salesperson.salpers_name%type;
    function getcomm (id salesperson.salpers_id%type)
        return salesperson.comm%type;
    function getcomm (name salesperson.salpers_name%type)
        return salesperson.comm%type;
    procedure spcustrpt (sid salesperson.salpers_id%type);


    procedure cust_transactions(cid customer.cust_id%type);


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
    procedure getmanager (sid salesperson.salpers_id%type);

    procedure sp_transactions(sid salesperson.salpers_id%type);

end salepack;
/
