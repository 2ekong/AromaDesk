-- 재고 업데이트 SQL
USE perfume_db;

-- 기존 상품들의 재고를 정상적으로 설정
UPDATE product SET stock = 50 WHERE id = 1;  -- 블루 향수
UPDATE product SET stock = 30 WHERE id = 2;  -- 핑크 향수  
UPDATE product SET stock = 40 WHERE id = 3;  -- 시트러스 향수
UPDATE product SET stock = 20 WHERE id = 4;  -- 우디 향수
UPDATE product SET stock = 25 WHERE id = 5;  -- 플로럴 향수

-- 재고 상태 확인
SELECT id, name, brand, stock FROM product ORDER BY id; 