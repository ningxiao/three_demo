-- 按语言类型统计
-- select
--   Language,
--   count(File) as files,
--   sum(nBlank) as blank,
--   sum(nComment) as comment,
--   sum(nCode) as code,
--   sum(nBlank) + sum(nComment) + sum(nCode) as Total
-- from
--   t
-- group by
--   Language
-- order by
--   code desc;
-- 统计code行数大于40
select
  File,
  nBlank + nComment + nCode as Lines
from
  t
where
  Lines > 40;

-- 统计code行数最大的文件
-- select
--   File,
--   nBlank + nComment + nCode as Lines
-- from
--   t
-- where
--   Lines = (
--     select
--       max(nBlank + nComment + nCode)
--     from
--       t
--   );
