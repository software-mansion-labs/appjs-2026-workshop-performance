-- Android unbounded memory growth: heap-graph queries (annotated for non-SQL folks)
--
-- Run in ui.perfetto.dev -> Query (SQL) tab, on a trace recorded with:
--   - data source: android.java_hprof
--   - process:    com.staszekscp.appjsperformanceworkshop
--   - continuous dump every 3000-5000 ms (you want a SERIES of dumps to compare)
--   - engagement tracking ON + repeatedly start/end post sessions by scrolling
--
-- ============================================================================
-- PLAIN-LANGUAGE GUIDE TO THE TABLES (you do not need Perfetto internals):
--
--   heap_graph_object    one row per object that exists in a heap dump.
--       graph_sample_ts    WHICH dump this object is from. Each dump has its own
--                          timestamp, so the same object seen in two dumps is two rows.
--                          "distinct graph_sample_ts" = "how many dumps".
--       type_id            the object's class, as a number -> join to heap_graph_class.id
--       self_size          shallow size: bytes of the object itself.
--       retained_size      bytes that would be freed if this object were collected
--                          (the object PLUS everything only it keeps alive).
--                          A big retained_size means "this one is holding a lot".
--
--   heap_graph_class     one row per class. Columns: id, name (full class name).
--
--   heap_graph_reference the EDGES of the object graph:
--                          owner_id  --field_name-->  owned_id
--                        i.e. object owner_id has a field that points at object owned_id.
--                        To find "who points at X", filter owned_id = X and read owner_id.
--
-- TWO SQL TRICKS USED BELOW (so they are not mysterious):
--   with mm as (...)     a named helper result computed once and reused (a CTE).
--                        Here it just holds the first (f) and last (l) dump timestamps.
--   sum(case when graph_sample_ts = <dump> then 1 else 0 end)
--                        "count the objects in that one dump": for every row add 1 if it
--                        belongs to that dump, else 0; the sum is the count for that dump.
--   glob '*ngagement*'   name contains "ngagement" (covers Engagement* classes).
--
-- If a column name errors on your Perfetto version, inspect the table first, e.g.:
--   select * from heap_graph_object limit 1;
--   select * from heap_graph_reference limit 1;
-- ============================================================================


-- 0. SANITY: how many heap dumps are in the trace?
--    You need more than one dump to see a trend over time.
select count(distinct graph_sample_ts) as num_dumps from heap_graph_object;


-- 1. GENERAL: for every Engagement class, how many instances in the FIRST dump vs the LAST,
--    and the difference (growth). The leaking type shows the biggest growth; stable types ~0.
--    'mm' holds the first (f) and last (l) dump timestamps; the case/sum lines count per dump.
with mm as (select min(graph_sample_ts) as f, max(graph_sample_ts) as l from heap_graph_object)
select c.name as class,
       sum(case when o.graph_sample_ts = (select f from mm) then 1 else 0 end) as first_n,
       sum(case when o.graph_sample_ts = (select l from mm) then 1 else 0 end) as last_n,
       sum(case when o.graph_sample_ts = (select l from mm) then 1 else 0 end)
       - sum(case when o.graph_sample_ts = (select f from mm) then 1 else 0 end) as growth
from heap_graph_object o
join heap_graph_class c on o.type_id = c.id
where c.name glob '*ngagement*'
group by c.name
order by growth desc;


-- 2. TREND: how many instances of ONE class in EACH dump, over time.
--    Replace INSERT_TYPE_NAME_HERE below with the class you found (from query 1 or 3),
--    a fully-qualified class name, e.g. com.example.MyType.
--    This is the leak's signature: a line that climbs dump after dump (and survives GC,
--    because java_hprof forces a GC before each dump, so what is left is genuinely retained).
--    Columns are named ts/value on purpose: run it, click "Add debug track", choose type
--    Counter, set ts = ts and value = value, and you get a rising line on the timeline.
select o.graph_sample_ts as ts, count(*) as value
from heap_graph_object o
join heap_graph_class c on o.type_id = c.id
where c.name = 'INSERT_TYPE_NAME_HERE'
group by o.graph_sample_ts
order by o.graph_sample_ts;


-- 3. APP-WIDE leak finder (bonus): the same first->last growth, but for EVERY class, top 30.
--    You do not even need to know it is Engagement; the top row reveals it, and it also
--    catches generic backing types (Object[], ArrayList, byte[]) that the buffer retains.
with mm as (select min(graph_sample_ts) as f, max(graph_sample_ts) as l from heap_graph_object)
select c.name as class,
       sum(case when o.graph_sample_ts = (select f from mm) then 1 else 0 end) as first_n,
       sum(case when o.graph_sample_ts = (select l from mm) then 1 else 0 end) as last_n,
       sum(case when o.graph_sample_ts = (select l from mm) then 1 else 0 end)
       - sum(case when o.graph_sample_ts = (select f from mm) then 1 else 0 end) as growth
from heap_graph_object o
join heap_graph_class c on o.type_id = c.id
group by c.name
having growth > 0
order by growth desc
limit 30;


-- 4. BYTES variant (bonus): growth measured in BYTES (self_size) instead of instance count,
--    useful when the issue is a few large objects rather than many small ones. Top 30 by bytes.
with mm as (select min(graph_sample_ts) as f, max(graph_sample_ts) as l from heap_graph_object)
select c.name as class,
       sum(case when o.graph_sample_ts = (select l from mm) then o.self_size else 0 end)
       - sum(case when o.graph_sample_ts = (select f from mm) then o.self_size else 0 end) as growth_bytes
from heap_graph_object o
join heap_graph_class c on o.type_id = c.id
group by c.name
having growth_bytes > 0
order by growth_bytes desc
limit 30;


-- 5. WHO HOLDS IT (bonus): the DIRECT referrer of your class in the last dump.
--    Replace INSERT_TYPE_NAME_HERE with the leaking class you found.
--    Uses the edge table: "what object points AT an instance of that class?".
--    'owned' = your object; 'owner' = whatever points at it (its holder).
--    Usually the direct holder is an Object[] / ArrayList (a per-item list). Go up one
--    or two more levels, or use the flamegraph, to reach the owning buffer.
with last_dump as (select max(graph_sample_ts) as ts from heap_graph_object)
select holder.name as holder_class, ref.field_name, count(*) as refs
from heap_graph_reference ref
join heap_graph_object owned   on ref.owned_id = owned.id
join heap_graph_class  owned_c on owned.type_id = owned_c.id
join heap_graph_object owner   on ref.owner_id = owner.id
join heap_graph_class  holder  on owner.type_id = holder.id
where owned_c.name = 'INSERT_TYPE_NAME_HERE'
  and owned.graph_sample_ts = (select ts from last_dump)
group by holder.name, ref.field_name
order by refs desc;


-- 6. WHO IS RESPONSIBLE (bonus): top classes by retained_size in the last dump.
--    retained_size = bytes that disappear if the object is collected (it + all it solely
--    keeps alive). The object that holds every sample bubbles to the top: that is the
--    culprit, found by "who retains the most" rather than "who allocated".
with last_dump as (select max(graph_sample_ts) as ts from heap_graph_object)
select c.name as class, count(*) as instances, sum(o.retained_size) as retained_bytes
from heap_graph_object o
join heap_graph_class c on o.type_id = c.id
where o.graph_sample_ts = (select ts from last_dump)
group by c.name
order by retained_bytes desc
limit 30;
