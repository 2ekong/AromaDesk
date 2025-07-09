package com.example.aromadesk.product.controller;

import com.example.aromadesk.product.dto.ProductRequestDTO;
import com.example.aromadesk.product.dto.ProductResponseDTO;
import com.example.aromadesk.product.entity.ProductStatus;
import com.example.aromadesk.product.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author : youngsic
 * @packageName : com.example.aromadesk.product.controller
 * @fileName : MemberProductController
 * @date : 25. 6. 19.
 * @mostRecent : 25. 6. 30
 *
 **/
@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class MemberProductController {
    private final ProductService productService;

    public MemberProductController(ProductService productService) {
        this.productService = productService;
    }

    // 필터링된 상품 목록 출력 (2025.06.30 검색기능 추가!)
    @GetMapping
    public ResponseEntity<?> getFilteredPagedProducts(
            @RequestParam(name = "brand", required = false) String brand,
            @RequestParam(name = "gender", required = false) String gender,
            @RequestParam(name = "volume", required = false) String volume,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "statuses", required = false) List<ProductStatus> status,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "50") int size
    ) {
        return ResponseEntity.ok(
//                productService.getFilteredPagedProducts(brand, gender, volume, page, size)
                productService.getFilteredSearchedPagedProducts(brand, gender, volume, keyword, status, page, size)
        );
    }

    // 특정 상품 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getProduct(@PathVariable("id") Long id) {
        ProductResponseDTO dto = productService.getProductById(id);
        return ResponseEntity.ok(dto);
    }

    // 브랜드 목록 조회
    @GetMapping("/brands")
    public ResponseEntity<List<String>> getBrands() {
        List<String> brands = productService.getAllBrands();
        return ResponseEntity.ok(brands);
    }
}
