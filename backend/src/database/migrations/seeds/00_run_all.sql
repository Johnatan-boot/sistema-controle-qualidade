-- =====================================================================
-- 00_RUN_ALL.SQL - Executa todos os arquivos de seed na ordem correta
-- Use no cliente `mysql` (não funciona via mysql2/multipleStatements):
--   mysql -u usuario -p nome_do_banco < 00_run_all.sql
-- Os 4 arquivos precisam estar na mesma pasta.
-- =====================================================================

SOURCE 01_catalogos.sql;
SOURCE 02_products.sql;
SOURCE 03_quality_records.sql;
SOURCE 04_verificacao.sql;
