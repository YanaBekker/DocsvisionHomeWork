-- Добавила роль наблюдатель и привязала ее к созданной функции

-- Итоговая таблица наблюдателей
SELECT *
FROM result_table;

-- main info карточек заявки на командировку
SELECT *
FROM "dvtable_{30eb9b87-822b-4753-9a50-a1825dca1b74}";

-- Функция для роли наблюдатель за городом
-- Возвращает список сотрудинков, 
-- которые являются наблюдателями за городом из секции Город в карточке заявка на командировку
CREATE OR REPLACE FUNCTION "dd_city_observer_role"(val_cardids uuid[])
RETURNS TABLE("CardID" uuid, "Value" uuid, "Type" integer)
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        main_info."InstanceID" as "CardID",
        obs."Emp_ID" as "Value",
        13 as "Type"
    FROM "dvtable_{30eb9b87-822b-4753-9a50-a1825dca1b74}" as main_info
    JOIN "result_table" obs 
        ON main_info."City" = obs."City_ID"  
    WHERE main_info."InstanceID" = ANY(val_cardids)
      AND obs."beWatched" = true;  
END;
$function$
LANGUAGE plpgsql;

-- InstanseId b6ef7e75-6662-429c-a274-34d57c76504e город москва
-- Проверка
SELECT *
FROM dd_city_observer_role('{b6ef7e75-6662-429c-a274-34d57c76504e}');

-- 52948d6d-3643-4354-810f-59b29979d6b0 emp_id 
-- Самсон\Внештатный персонал\Группа 082,
--Валентин Адамович Свахин,
--Наблюдатель,
--Москва:да Санкт-Петербург:да Самара:нет

DROP FUNCTION "dd_city_observer_role";




-----------------------------------------------------------------------------------------------------------------

-- Включаем расширенный сбор статистики
SET max_parallel_workers_per_gather = 4;
SET work_mem = '1GB';

-- Выполняем EXPLAIN ANALYZE
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM "dd_city_observer_role"(
    ARRAY(SELECT "InstanceID" FROM "dvtable_{30eb9b87-822b-4753-9a50-a1825dca1b74}" LIMIT 1000)
);

-- Индекс для быстрого поиска заявок по InstanceID
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_trip_requests_instance_id 
ON "dvtable_{30eb9b87-822b-4753-9a50-a1825dca1b74}" ("InstanceID");

-- Индекс для поиска по городу в заявках
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_trip_requests_city 
ON "dvtable_{30eb9b87-822b-4753-9a50-a1825dca1b74}" ("City");

-- Составной индекс для наблюдателей (город + статус)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_result_table_city_watched 
ON result_table ("City_ID", "beWatched");

-- Индекс для быстрого фильтра наблюдателей
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_result_table_watched 
ON result_table ("beWatched") WHERE "beWatched" = true;

-- Индекс для связи по Emp_ID
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_result_table_emp_id 
ON result_table ("Emp_ID");

CREATE OR REPLACE FUNCTION "dd_city_observer_role_optimized"(val_cardids uuid[])
RETURNS TABLE("CardID" uuid, "Value" uuid, "Type" integer)
AS $function$
BEGIN
    RETURN QUERY
    WITH filtered_cards AS (
        -- Используем индекс по InstanceID
        SELECT "InstanceID", "City"
        FROM "dvtable_{30eb9b87-822b-4753-9a50-a1825dca1b74}"
        WHERE "InstanceID" = ANY(val_cardids)
    ),
    city_observers AS (
        -- Используем индекс по городу и статусу
        SELECT "City_ID", "Emp_ID"
        FROM result_table
        WHERE "beWatched" = true
    )
    SELECT 
        fc."InstanceID" as "CardID",
        co."Emp_ID" as "Value", 
        13 as "Type"
    FROM filtered_cards fc
    JOIN city_observers co ON fc."City" = co."City_ID";
END;
$function$
LANGUAGE plpgsql;


-- Сравнение производительности до и после оптимизации
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM "dd_city_observer_role"(
    ARRAY(SELECT "InstanceID" FROM "dvtable_{30eb9b87-822b-4753-9a50-a1825dca1b74}" LIMIT 1000)
);

EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM "dd_city_observer_role_optimized"(
    ARRAY(SELECT "InstanceID" FROM "dvtable_{30eb9b87-822b-4753-9a50-a1825dca1b74}" LIMIT 1000)
);

-- Обновляем статистику после создания индексов
ANALYZE "dvtable_{30eb9b87-822b-4753-9a50-a1825dca1b74}";
ANALYZE result_table;

-- Финальная оптимизированная функция
CREATE OR REPLACE FUNCTION "dd_city_observer_role_final"(val_cardids uuid[])
RETURNS TABLE("CardID" uuid, "Value" uuid, "Type" integer)
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        tr."InstanceID" as "CardID",
        rt."Emp_ID" as "Value",
        13 as "Type"
    FROM "dvtable_{30eb9b87-822b-4753-9a50-a1825dca1b74}" tr
    INNER JOIN result_table rt 
        ON tr."City" = rt."City_ID" 
        AND rt."beWatched" = true
    WHERE tr."InstanceID" = ANY(val_cardids);
END;
$function$
LANGUAGE plpgsql;

-- Сравнение производительности до и после оптимизации
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM "dd_city_observer_role"(
    ARRAY(SELECT "InstanceID" FROM "dvtable_{30eb9b87-822b-4753-9a50-a1825dca1b74}" LIMIT 1000)
);

EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM "dd_city_observer_role_final"(
    ARRAY(SELECT "InstanceID" FROM "dvtable_{30eb9b87-822b-4753-9a50-a1825dca1b74}" LIMIT 1000)
);
