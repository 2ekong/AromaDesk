package com.example.aromadesk.product.dto;

import com.example.aromadesk.product.entity.Product;
import com.example.aromadesk.product.entity.ProductStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProductResponseDTO {
    private Long id;
    private String name;
    private String brand;
    private String genderCategory;
    private String volumeCategory;
    private int price;
    private int stock;           // 🔹 재고 수량 추가
    private String imageUrl;
    private String description;      // 🔹 상세 설명
    private String createdAt;        // 🔹 등록일 (형식화해서 String으로 반환)
    private ProductStatus status;

    public ProductResponseDTO(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.brand = product.getBrand();
        this.genderCategory = product.getGenderCategory();
        this.volumeCategory = product.getVolumeCategory();
        this.price = product.getPrice();
        this.stock = product.getStock();        // 🔹 재고 수량 설정
        this.imageUrl = product.getImageUrl();
        this.description = product.getDescription();
        this.createdAt = product.getCreatedAt() != null
                ? product.getCreatedAt().toString().substring(0, 10)  // "YYYY-MM-DD"
                : null;
        this.status = product.getStatus();
    }
}