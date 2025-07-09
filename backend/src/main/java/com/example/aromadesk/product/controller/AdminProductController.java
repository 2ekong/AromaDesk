package com.example.aromadesk.product.controller;

import com.example.aromadesk.product.dto.ProductRequestDTO;
import com.example.aromadesk.product.dto.ProductResponseDTO;
import com.example.aromadesk.product.dto.StatusUpdateRequestDTO;
import com.example.aromadesk.product.entity.ProductStatus;
import com.example.aromadesk.product.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author : youngsic
 * @packageName : com.example.aromadesk.product.controller
 * @fileName : AdminProductController
 * @date : 25. 6. 30.
 **/
@RestController
@RequestMapping("/api/admin/products")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminProductController {
    private final ProductService productService;

    public AdminProductController(ProductService productService) { this.productService = productService; }

    /**
     * 상품 등록
     *
     * @param productRequestDTO 등록할 상품의 정보를 담고 있는 DTO
     * @return 실패 or (성공 메세지 + 등록된 상품의 정보)
     */
    @PostMapping
    public ResponseEntity<ProductResponseDTO> createProduct(@RequestBody ProductRequestDTO productRequestDTO) {
        return ResponseEntity.ok(productService.createProduct(productRequestDTO));
    }

    /**
     * 상품 수정
     *
     * @param id 수정할 상품의 id
     * @param productRequestDTO 수정할 상품의 정보를 담고 있는 DTO
     * @return 실패 or (성공 메세지 + 수정된 상품의 정보)
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> updateProduct(@PathVariable("id") Long id, @RequestBody ProductRequestDTO productRequestDTO) {
        return ResponseEntity.ok(productService.updateProduct(id, productRequestDTO));
    }

    /**
     * 상품 삭제(논리 삭제)
     *
     * @param id 삭제할 상품의 id
     * @return 실패 메세지 or 204 메세지(상품 삭제 성공일 때)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> deleteProduct(@PathVariable("id") Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * status 칼럼만 중점으로 변경
     *
     * @param id status값을 변경할 상품의 id
     * @param requestDTO 변경될 status값을 가지고 있는 DTO : {"status" : INACTIVE}
     * @return 실패 메세지 or 204 메세지(status값 변경 성공일 때)
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateProductStatus(@PathVariable("id") Long id, @RequestBody StatusUpdateRequestDTO requestDTO) {
        productService.updateProductStatus(id, requestDTO.getStatus());
        return ResponseEntity.noContent().build();
    }

    /**
     * 요청된 파라미터의 종류에 따라 해당하는 상품의 목록을 반환
     *
     * @param brand 출력될 상품의 브랜드명
     * @param gender 출력될 상품의 추천 성별
     * @param volume 출력될 상품의 용량
     * @param keyword 출력될 상품의 키워드
     * @param page 현재 페이지 넘버
     * @param size 한 페이지당 출력되는 상품 갯수
     * @return 실패 or(성공 메세지 + 파라미터 값에 따라 필터링된 향수 목록)
     */
    @GetMapping
    public ResponseEntity<?> getFilteredPagedProducts(
            @RequestParam(name = "brand", required = false) String brand,
            @RequestParam(name = "gender", required = false) String gender,
            @RequestParam(name = "volume", required = false) String volume,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "statuses", required = false) List<ProductStatus> statuses,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "20") int size
    ) {
        if (brand != null && brand.isEmpty()) brand = null;
        if (gender != null && gender.isEmpty()) gender = null;
        if (volume != null && volume.isEmpty()) volume = null;
        if (keyword != null && keyword.isEmpty()) keyword = null;
        return ResponseEntity.ok(
                productService.getFilteredSearchedPagedProducts(brand, gender, volume, keyword, statuses, page, size)
        );
    }

    /**
     * DB에 저장된 모든 브랜드명 반환
     *
     * @return 실패 or (성공 메세지 + db에 저장된 모든 브랜드 명 컬럼)
     */
    @GetMapping("/brands")
    public ResponseEntity<List<String>> getAllBrands() {
        return ResponseEntity.ok(productService.getAllBrands());
    }

}
