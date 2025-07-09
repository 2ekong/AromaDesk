package com.example.aromadesk.product.entity;

/**
 * 논리적 삭제체리 및 상품 상태 표시
 *
 * @packageName : com.example.aromadesk.product.entity
 * @fileName : ProductStatus
 * @author : youngsic
 * @date : 25. 7. 3.
 * 
 * 
 *
 **/

public enum ProductStatus {
    ACTIVE, // 판매중
    INACTIVE, // 일시 판매 중단
    SOLD_OUT, // 품절(재입고 가능)
    DISCONTINUED, // 단종
    DELETED, // 논리적 삭제처리
    HOT // 인기상품
}
