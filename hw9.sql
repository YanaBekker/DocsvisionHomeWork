-- create view for homework 9
CREATE VIEW dd_emp_dep
AS
SELECT 
	emp."RowID", 
	dep."Name" 
FROM "dvtable_{dbc8ae9d-c1d2-4d5e-978b-339d22b32482}" AS emp
JOIN "dvtable_{7473f07f-11ed-4762-9f1e-7ff10808ddd1}" AS dep 
		ON split_part(emp."ParentSectionTreeKey"::text, '.', 2) = dep."SystemTreeID"::text;

-- see view
SELECT *
FROM "dd_emp_dep";



-----------------------------------------------------------------------------------------------------------------

-- employee
SELECT *
FROM "dvtable_{dbc8ae9d-c1d2-4d5e-978b-339d22b32482}" AS emp;

-- departmens
SELECT *
FROM "dvtable_{7473f07f-11ed-4762-9f1e-7ff10808ddd1}" AS dep;

-- Business Directory line card
SELECT *
FROM "dvtable_{1b1a44fb-1fb1-4876-83aa-95ad38907e24}" AS dir_line;

-- The Directory Constructor
SELECT *
FROM "dvtable_{a1dce6c1-db96-4666-b418-5a075cdb02c9}" AS string_guide;

-- Gropus
SELECT *
FROM "dvtable_{5b607ffc-7ea2-47b1-90d4-bb72a0fe7280}" AS all_group;

-- Таблица должности
SELECT *
FROM "dvtable_{cfdfe60a-21a8-4010-84e9-9d2df348508c}" AS position_table;

------------------------------------------------------------------------------------------------------------------


-- Добавила новый город самара руками в справочнике 
-- (но могла и как с должностью ниже скрипт написать но уже получилось как получилось)

-- Удаление таблицы если не получилось нормально создать...
DROP TABLE temp_data;

-- Создание таблицы для выгрузки данных
CREATE TABLE temp_data (
    path_subdep TEXT,
    full_name TEXT,
    position TEXT,
    locations TEXT
);

-- Выгрузка данных из csv файла в таблицу
COPY temp_data FROM '/tmp/data.csv' WITH (FORMAT CSV);

-- Вывод выгруженных данных
SELECT *
FROM temp_data;

-- Разбиение данных
CREATE TABLE employees_locations AS
SELECT 
    split_part(path_subdep, E'\\', 1) as company,
    split_part(path_subdep, E'\\', 2) as department,
    split_part(path_subdep, E'\\', 3) as group_name,
    full_name,
    position,
    split_part(location_item, ':', 1) as city,
    split_part(location_item, ':', 2) as status
FROM temp_data,
LATERAL regexp_split_to_table(
    regexp_replace(locations, '\\s+', ' ', 'g'), 
    ' '
) as location_item
WHERE location_item != '';

-- Вывод новой таблицы
SELECT * FROM employees_locations;


-- Создание таблицы новых подразделений
CREATE TABLE departments AS
SELECT DISTINCT
    company,
    department,
    group_name
FROM employees_locations;

-- Проверяем результат
SELECT * FROM departments;

-- Добавляем данные о новых подразделениях 
INSERT INTO "dvtable_{7473f07f-11ed-4762-9f1e-7ff10808ddd1}" (
    "ParentTreeRowID", 
    "SystemTreeID", 
    "SectionTreeKey",
    "SDID",
    "Name"
)
SELECT 
    'd79b8c8f-9786-4a69-bd9f-5788c495e25f' as "ParentTreeRowID", 
    ((SELECT "SystemTreeID" 
    FROM "dvtable_{7473f07f-11ed-4762-9f1e-7ff10808ddd1}" 
    WHERE "RowID" = 'd79b8c8f-9786-4a69-bd9f-5788c495e25f') + ROW_NUMBER() OVER()) as "SystemTreeID",
    ((SELECT "SectionTreeKey" 
    FROM "dvtable_{7473f07f-11ed-4762-9f1e-7ff10808ddd1}" 
    WHERE "RowID" = 'd79b8c8f-9786-4a69-bd9f-5788c495e25f')::text || '.' || 
        ((SELECT "SystemTreeID" 
        FROM "dvtable_{7473f07f-11ed-4762-9f1e-7ff10808ddd1}" 
        WHERE "RowID" = 'd79b8c8f-9786-4a69-bd9f-5788c495e25f') + ROW_NUMBER() OVER())::text)::ltree as "SectionTreeKey",
    'eba190bd-ae83-4935-ba62-c455050435a6' as "SDID",
    group_name as "Name"
FROM departments
WHERE company = 'Самсон' AND department = 'Внештатный персонал';

-- Вставка новой должности
INSERT INTO "dvtable_{cfdfe60a-21a8-4010-84e9-9d2df348508c}" ("Name")
SELECT DISTINCT position
FROM employees_locations;

-- Добавляем новых сотрудников
INSERT INTO "dvtable_{dbc8ae9d-c1d2-4d5e-978b-339d22b32482}" (
	"ParentRowID",
	"ParentSectionTreeKey",
	"SDID",
	"FirstName",
	"MiddleName",
	"LastName",
	"Position"
)
SELECT distinct
	(SELECT "RowID" 
	FROM "dvtable_{7473f07f-11ed-4762-9f1e-7ff10808ddd1}"
	WHERE "group_name" = "Name"),
	(SELECT "SectionTreeKey" 
	FROM "dvtable_{7473f07f-11ed-4762-9f1e-7ff10808ddd1}"
	WHERE "group_name" = "Name"),
	'eba190bd-ae83-4935-ba62-c455050435a6'::uuid,
	split_part(full_name, ' ', 1),
    split_part(full_name, ' ', 2),
    split_part(full_name, ' ', 3),
    (SELECT "RowID" FROM "dvtable_{cfdfe60a-21a8-4010-84e9-9d2df348508c}"
    WHERE "Name" = position)
FROM employees_locations;




-----------------------------------------------------------------------------------------------------------------


-- Свяжем все эти таблицы в одну таблицу наблюдателей за городами по ID из системных таблиц
CREATE TABLE result_table AS
SELECT
    emp."RowID" AS "Emp_ID",
    city."RowID" AS "City_ID",
    CASE 
        WHEN el.status = 'да' THEN TRUE
        ELSE FALSE
    END AS "beWatched"
FROM employees_locations el
JOIN "dvtable_{dbc8ae9d-c1d2-4d5e-978b-339d22b32482}" emp 
    ON split_part(el.full_name, ' ', 1) = emp."FirstName" 
    AND split_part(el.full_name, ' ', 2) = emp."MiddleName"
    AND split_part(el.full_name, ' ', 3) = emp."LastName"
JOIN "dvtable_{1b1a44fb-1fb1-4876-83aa-95ad38907e24}" city 
    ON el.city = city."Name";

-- Проверка результата
SELECT *
FROM result_table;

-- Безвозвратное удаление в случаи неудачи....
DROP TABLE result_table;