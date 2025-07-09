package com.example.aromadesk.product.dto;

import com.example.aromadesk.product.entity.ProductStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProductRequestDTO {
    private String name;
    private String brand;
    private String genderCategory;
    private String volumeCategory;
    private int price;
    private int stock;
    private String imageUrl;
    private String description;
    private ProductStatus status;
}
