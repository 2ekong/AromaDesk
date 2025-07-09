DROP DATABASE perfume_db;

CREATE DATABASE perfume_db;

USE perfume_db;

-- 회원 테이블
CREATE TABLE member (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id varchar(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    zip_code VARCHAR(20),         -- ★ 우편번호(신규 추가)
    address_detail VARCHAR(255),  -- ★ 상세주소(신규 추가)
    role VARCHAR(20) DEFAULT 'USER', -- 기본적으로는 USER 추후에 등급이 추가 될 수도 있을거 같아서 존속하는걸로 결정
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 배송주소 테이블
CREATE TABLE member_address (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    address VARCHAR(255) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    alias VARCHAR(50), -- ex: '집', '회사'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES member(id)
);

-- 상품 테이블
CREATE TABLE product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    brand VARCHAR(50),                         -- 브랜드명 (예: Chanel)
    gender_category VARCHAR(20),               -- 'MALE', 'FEMALE', 'UNISEX'
    volume_category VARCHAR(20),               -- 'UNDER_30ML', 'UNDER_50ML', 'LARGE'
    price BIGINT NOT NULL,
    stock BIGINT DEFAULT 0,
    image_url VARCHAR(500),
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'ACTIVE',       -- ✅ 상태 컬럼 추가
    CHECK (status IN ('ACTIVE', 'SOLD_OUT', 'DISCONTINUED', 'INACTIVE', 'DELETED', 'HOT')) -- 상태 제약
);

-- 장바구니 테이블
CREATE TABLE cart (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES member(id),
    FOREIGN KEY (product_id) REFERENCES product(id),
    UNIQUE (member_id, product_id) -- ✅ 중복 방지
);

-- 주문 테이블
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    total_price INT NOT NULL,
    payment_method VARCHAR(20) NOT NULL, -- MOCK, CARD, BANK
    status VARCHAR(20) DEFAULT 'ORDERED', -- ORDERED, PAID, CANCELLED
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES member(id)
);

-- 주문 상세 항목
CREATE TABLE order_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES product(id),
    UNIQUE (order_id, product_id) -- ✅ 중복 방지
);

-- 배송 테이블
CREATE TABLE delivery (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    address VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'PREPARING', -- PREPARING, SHIPPED, DELIVERED
    tracking_number VARCHAR(100),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- 관리자 테이블
CREATE TABLE admin (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(50),
    role VARCHAR(20) DEFAULT 'ADMIN',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 공통 코드 테이블
CREATE TABLE common_code (
    code VARCHAR(50) PRIMARY KEY,       -- 코드값 (예: MALE, UNDER_30ML)
    group_name VARCHAR(50) NOT NULL,    -- 그룹명 (예: GENDER, VOLUME, BRAND)
    label VARCHAR(100) NOT NULL,        -- 출력용 이름 (예: 남성용)
    parent_code VARCHAR(50),            -- 상위 코드 (NULL이면 루트)
    sort_order INT DEFAULT 0,           -- 정렬 순서
    is_active BOOLEAN DEFAULT TRUE     -- 사용 여부
);