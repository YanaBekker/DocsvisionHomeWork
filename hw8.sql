-- check script
SELECT 
	reqinfo."Author",
	reqinfo."Business_trip_dates_from"::DATE,
	reqinfo."City",
	reqinfo."ReasonTrip",
	reqinfo."State" 
FROM "dvtable_{30eb9b87-822b-4753-9a50-a1825dca1b74}" AS reqinfo
WHERE 
	reqinfo."Author" = '04b45ddc-3cbc-4a73-addd-92db210eeb7a' and
	reqinfo."Kind" = '1dcfc6da-7fe2-4157-9a86-69a1e32f5ff3'
ORDER BY 2;

-- info

--semenov 04b45ddc-3cbc-4a73-addd-92db210eeb7a
-- ivanov f965fa69-aac8-4417-b5cd-f000662e32f5


-- main function
SELECT *
FROM "getReqComInfo"('1bdddb53-2971-45e0-9e10-99c03b9692bc');

CREATE OR REPLACE FUNCTION "getReqComInfo"(val_employeeid uuid)
	RETURNS TABLE (
	    business_trip_dates_from DATE,
	    city uuid,
	    reason_trip text,
	    state uuid
	)	
	LANGUAGE plpgsql
	AS $function$
	BEGIN
		return QUERY(
			SELECT 
				reqinfo."Business_trip_dates_from"::DATE,
				reqinfo."City",
				reqinfo."ReasonTrip",
				reqinfo."State" 
			FROM "dvtable_{30eb9b87-822b-4753-9a50-a1825dca1b74}" AS reqinfo
			WHERE 
				reqinfo."Author" = val_employeeid and
				reqinfo."Kind" = '1dcfc6da-7fe2-4157-9a86-69a1e32f5ff3'
		);
END;
$function$;


-- del function
DROP FUNCTION "getReqComInfo"(uuid);