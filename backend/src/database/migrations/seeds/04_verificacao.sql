-- =====================================================================
-- 04_VERIFICACAO.SQL - CONFERENCIA RAPIDA DE CONTAGENS
-- =====================================================================

-- Verificacao rapida
SELECT COUNT(*) AS setores FROM sectors;
SELECT COUNT(*) AS status FROM statuses;
SELECT COUNT(*) AS divergencias FROM divergence_types;
SELECT COUNT(*) AS fornecedores FROM suppliers;
SELECT COUNT(*) AS produtos FROM products;
SELECT COUNT(*) AS registros FROM quality_records;

-- Esperado: 4 setores, 3 status, 19 divergencias, 51 fornecedores, 17118 produtos unicos, 42 registros.
