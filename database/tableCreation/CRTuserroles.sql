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
        CASE
            WHEN EXISTS(SELECT * FROM tafor tf WHERE tf.netid = u.netid) THEN 1
            ELSE 0
        END AS ta
    FROM users u
         FULL OUTER JOIN student s ON u.netid = s.netid
 	     FULL OUTER JOIN professor p ON u.netid = p.netid
/
