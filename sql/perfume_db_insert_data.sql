-- ✅ 공통 코드: 그룹 코드 삽입
-- 1. 그룹 코드 (루트 그룹)
INSERT INTO common_code (code, group_name, label, parent_code, sort_order) VALUES
('GENDER', 'GROUP', '성별 분류', NULL, 1),
('VOLUME', 'GROUP', '용량 분류', NULL, 2),
('BRAND', 'GROUP', '브랜드 분류', NULL, 3),
('ORDER_STATUS', 'GROUP', '주문 상태 분류', NULL, 4),
('PAYMENT_METHOD', 'GROUP', '결제 방식 분류', NULL, 5),
('DELIVERY_STATUS', 'GROUP', '배송 상태 분류', NULL, 6);

-- 2. GENDER 하위 코드
INSERT INTO common_code (code, group_name, label, parent_code, sort_order) VALUES
('MALE', 'GENDER', '남성', 'GENDER', 1),
('FEMALE', 'GENDER', '여성', 'GENDER', 2),
('UNISEX', 'GENDER', '남녀공용', 'GENDER', 3);

-- 3. VOLUME 하위 코드
INSERT INTO common_code (code, group_name, label, parent_code, sort_order) VALUES
('UNDER_30ML', 'VOLUME', '30ml', 'VOLUME', 1),
('UNDER_50ML', 'VOLUME', '50ml', 'VOLUME', 2),
('LARGE', 'VOLUME', '대용량', 'VOLUME', 3);

-- 4. BRAND 하위 코드
INSERT INTO common_code (code, group_name, label, parent_code, sort_order) VALUES
('CHANEL', 'BRAND', '샤넬', 'BRAND', 1),
('DIOR', 'BRAND', '디올', 'BRAND', 2),
('GUCCI', 'BRAND', '구찌', 'BRAND', 3),
('YSL', 'BRAND', '입생로랑', 'BRAND', 4),
('HERMES', 'BRAND', '에르메스', 'BRAND', 5);

-- 5. ORDER_STATUS 하위 코드
INSERT INTO common_code (code, group_name, label, parent_code, sort_order) VALUES
('ORDERED', 'ORDER_STATUS', '주문 완료', 'ORDER_STATUS', 1),
('PAID', 'ORDER_STATUS', '결제 완료', 'ORDER_STATUS', 2),
('CANCELLED', 'ORDER_STATUS', '주문 취소', 'ORDER_STATUS', 3);

-- 6. PAYMENT_METHOD 하위 코드
INSERT INTO common_code (code, group_name, label, parent_code, sort_order) VALUES
('MOCK', 'PAYMENT_METHOD', '모의 결제', 'PAYMENT_METHOD', 1),
('CARD', 'PAYMENT_METHOD', '카드 결제', 'PAYMENT_METHOD', 2),
('BANK', 'PAYMENT_METHOD', '무통장 입금', 'PAYMENT_METHOD', 3);

-- 7. DELIVERY_STATUS 하위 코드
INSERT INTO common_code (code, group_name, label, parent_code, sort_order) VALUES
('PREPARING', 'DELIVERY_STATUS', '배송 준비 중', 'DELIVERY_STATUS', 1),
('SHIPPED', 'DELIVERY_STATUS', '배송 중', 'DELIVERY_STATUS', 2),
('DELIVERED', 'DELIVERY_STATUS', '배송 완료', 'DELIVERY_STATUS', 3);


-- ✅ 회원(member) 삽입
INSERT INTO member (member_id, email, password, name, phone, address, zip_code, address_detail)
VALUES
    ('user001', 'user001@example.com', '$2a$10$Mwuo/rTLcG4JEI5DFnvGzut4jDUzVAiIHKcfvTxsJx93XjeBNjEPq', '홍길동', '010-1111-1111', '서울시 강남구', '06234', '101동 1101호'),
    ('user002', 'user002@example.com', '$2a$10$Mwuo/rTLcG4JEI5DFnvGzut4jDUzVAiIHKcfvTxsJx93XjeBNjEPq', '김영희', '010-2222-2222', '부산시 해운대구', '48094', '201동 203호'),
    ('user003', 'user003@example.com', '$2a$10$Mwuo/rTLcG4JEI5DFnvGzut4jDUzVAiIHKcfvTxsJx93XjeBNjEPq', '이철수', '010-3333-3333', '대전시 유성구', '34139', '305동 1802호'),
    ('user004', 'user004@example.com', '$2a$10$Mwuo/rTLcG4JEI5DFnvGzut4jDUzVAiIHKcfvTxsJx93XjeBNjEPq', '박민수', '010-4444-4444', '인천시 남동구', '21558', '아파트 303호'),
    ('user005', 'user005@example.com', '$2a$10$Mwuo/rTLcG4JEI5DFnvGzut4jDUzVAiIHKcfvTxsJx93XjeBNjEPq', '최지은', '010-5555-5555', '대구시 수성구', '42079', '빌라 402호');

-- ✅ 회원별 기본 배송지 및 추가 배송지 삽입
INSERT INTO member_address (member_id, address, is_default, alias)
VALUES
    (1, '서울시 강남구 삼성동 123-4', TRUE, '집'),
    (1, '서울시 강남구 테헤란로 456', FALSE, '회사'),
    (2, '부산시 해운대구 우동 123', TRUE, '집'),
    (3, '대전시 유성구 봉명동 77-1', TRUE, '집'),
    (4, '인천시 남동구 논현동 55-8', TRUE, '집'),
    (5, '대구시 수성구 범어동 99', TRUE, '집'),
    (5, '대구시 달서구 본동 12-34', FALSE, '회사');

-- ✅ 관리자(admin) 삽입
INSERT INTO admin (username, password, name)
VALUES
    ('admin01', '$2a$10$UFp6x8HILT5yR4qon16/xOm27.G4g6n4nztIF736mIE08wCj08poO', '관리자A'),
    ('admin02', '$2a$10$UFp6x8HILT5yR4qon16/xOm27.G4g6n4nztIF736mIE08wCj08poO', '관리자B'),
    ('admin03', '$2a$10$UFp6x8HILT5yR4qon16/xOm27.G4g6n4nztIF736mIE08wCj08poO', '관리자C'),
    ('admin04', '$2a$10$UFp6x8HILT5yR4qon16/xOm27.G4g6n4nztIF736mIE08wCj08poO', '관리자D'),
    ('admin05', '$2a$10$UFp6x8HILT5yR4qon16/xOm27.G4g6n4nztIF736mIE08wCj08poO', '관리자E');

-- ✅ 상품(product) 삽입
INSERT INTO product (name, brand, gender_category, volume_category, price, stock, image_url, description)
VALUES
    ('블루 향수', 'CHANEL', 'MALE', 'UNDER_50ML', 120000, 50, 'https://www.worldperfume.co.kr/shopimages/hjwych/4070020000182.jpg?1747379028', '시원한 바다 느낌의 향수입니다.'),
    ('핑크 향수', 'DIOR', 'FEMALE', 'UNDER_30ML', 90000, 30, 'https://www.worldperfume.co.kr/shopimages/hjwych/4070020000182.jpg?1747379028', '부드러운 꽃향기 향수입니다.'),
    ('시트러스 향수', 'HERMES', 'UNISEX', 'LARGE', 150000, 40, 'https://www.worldperfume.co.kr/shopimages/hjwych/4070020000182.jpg?1747379028', '상큼한 과일향이 매력적인 향수입니다.'),
    ('우디 향수', 'GUCCI', 'MALE', 'LARGE', 170000, 20, 'https://www.worldperfume.co.kr/shopimages/hjwych/4070020000182.jpg?1747379028', '우디 향조로 남성미를 강조한 향수입니다.'),
    ('플로럴 향수', 'YSL', 'FEMALE', 'UNDER_50ML', 110000, 25, 'https://www.worldperfume.co.kr/shopimages/hjwych/4070020000182.jpg?1747379028', '은은한 꽃향기 향수입니다.');

-- ✅ 주문(orders) 삽입 (payment_method: MOCK으로 통일)
INSERT INTO orders (member_id, total_price, payment_method, status)
VALUES
(1, 210000, 'MOCK', 'ORDERED'),
(2, 180000, 'MOCK', 'PAID'),
(3, 120000, 'MOCK', 'CANCELLED'),
(4, 150000, 'MOCK', 'PAID'),
(5, 90000,  'MOCK', 'ORDERED');


-- ✅ 주문 상세(order_item) 삽입
INSERT INTO order_item (order_id, product_id, quantity, price)
VALUES
(1, 1, 1, 120000),
(1, 2, 1, 90000),
(2, 3, 1, 150000),
(2, 2, 1, 30000),
(3, 5, 1, 120000);

-- ✅ 장바구니(cart) 삽입
INSERT INTO cart (member_id, product_id, quantity)
VALUES
(1, 4, 1),
(2, 1, 2),
(3, 3, 1),
(4, 5, 2),
(5, 2, 1);

-- ✅ 배송(delivery) 삽입
INSERT INTO delivery (order_id, address, status, tracking_number)
VALUES
(1, '서울시 강남구 배송지', 'PREPARING', 'TRK001'),
(2, '부산시 해운대구 배송지', 'SHIPPED', 'TRK002'),
(3, '대전시 유성구 배송지', 'PREPARING', NULL),
(4, '인천시 남동구 배송지', 'DELIVERED', 'TRK004'),
(5, '대구시 수성구 배송지', 'PREPARING', 'TRK005');