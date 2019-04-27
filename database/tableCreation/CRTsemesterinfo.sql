CREATE OR REPLACE VIEW semesterinfo AS
    SELECT
        sid,
        startdate,
        enddate,
        season || ' ' || yr AS name
    FROM (
        SELECT
            s.semester_id as sid,
            s.startdate,
            s.enddate,
            CASE EXTRACT(month from s.startdate)
                WHEN 1 THEN 'Spring'
                WHEN 8 THEN 'Fall'
                ELSE 'Unknown Season'
            END AS season,
            EXTRACT(year from s.startdate) as yr
        FROM semester s
    )
/
