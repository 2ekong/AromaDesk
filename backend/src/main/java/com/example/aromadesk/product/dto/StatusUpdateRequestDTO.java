package com.example.aromadesk.product.dto;

import com.example.aromadesk.product.entity.ProductStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class StatusUpdateRequestDTO {
    private ProductStatus status;
}
