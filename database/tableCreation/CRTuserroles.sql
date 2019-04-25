CREATE OR REPLACE VIEW userroles AS
    SELECT
        u.netid AS netid,
        u.admin AS admin,
        CASE
		    WHEN s.netid IS NULL THEN 0
            ELSE 1
  	    END AS student,
	    CASE
 		    WHEN p.netid IS NULL THEN 0
 		    ELSE 1
        END AS professor,
        0 AS ta
    FROM users u
         FULL OUTER JOIN student s ON u.netid = s.netid
 	     FULL OUTER JOIN professor p ON u.netid = p.netid
/
