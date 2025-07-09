-- 테스트용 상품 5개 생성 (재고 포함)
USE perfume_db;

-- 기존 테스트 상품들 삭제 (선택사항)
-- DELETE FROM product WHERE id <= 5;

-- 테스트용 상품 5개 삽입 (재고 포함)
INSERT INTO product (name, brand, gender_category, volume_category, price, stock, image_url, description) VALUES
    ('샤넬 블루 드 샤넬 EDP', 'CHANEL', 'MALE', 'UNDER_50ML', 180000, 25, 'https://www.worldperfume.co.kr/shopimages/hjwych/4070020000182.jpg?1747379028', '남성용 우아한 우디 향수입니다.'),
    ('디올 미스 디올 EDP', 'DIOR', 'FEMALE', 'UNDER_30ML', 150000, 30, 'https://www.worldperfume.co.kr/shopimages/hjwych/4070020000182.jpg?1747379028', '여성용 로맨틱한 플로럴 향수입니다.'),
    ('구찌 블룸 EDP', 'GUCCI', 'FEMALE', 'LARGE', 120000, 15, 'https://www.worldperfume.co.kr/shopimages/hjwych/4070020000182.jpg?1747379028', '여성용 상큼한 화이트 플로럴 향수입니다.'),
    ('입생로랑 블랙 오피엄 EDP', 'YSL', 'UNISEX', 'UNDER_50ML', 200000, 20, 'https://www.worldperfume.co.kr/shopimages/hjwych/4070020000182.jpg?1747379028', '남녀공용 미스터리한 오리엔탈 향수입니다.'),
    ('에르메스 테르 데르메스 EDT', 'HERMES', 'UNISEX', 'LARGE', 160000, 35, 'https://www.worldperfume.co.kr/shopimages/hjwych/4070020000182.jpg?1747379028', '남녀공용 신선한 그린 향수입니다.');

-- 재고 상태 확인
SELECT id, name, brand, stock, price FROM product ORDER BY id DESC LIMIT 5; 