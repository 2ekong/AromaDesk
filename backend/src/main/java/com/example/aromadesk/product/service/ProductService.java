package com.example.aromadesk.product.service;

import com.example.aromadesk.product.dto.ProductRequestDTO;
import com.example.aromadesk.product.dto.ProductResponseDTO;
import com.example.aromadesk.product.entity.Product;
import com.example.aromadesk.product.entity.ProductStatus;
import com.example.aromadesk.product.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class    ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(ProductResponseDTO::new)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getFilteredPagedProducts(List<ProductStatus> statuses, String brand, String gender, String volume, int page, int size) {
        List<Product> all = productRepository.findFilteredList(statuses, brand, gender, volume);

        int fromIndex = Math.max((page - 1) * size, 0);
        int toIndex = Math.min(fromIndex + size, all.size());
        List<Product> paged = all.subList(fromIndex, toIndex);

        List<ProductResponseDTO> content = paged.stream().map(ProductResponseDTO::new).toList();

        return Map.of(
                "content" , content,
                "totalElements", all.size(),
                "page", page,
                "size", size,
                "totalPages", (int)Math.ceil((double) all.size()/size)
        );
    }

    // 필터 + 검색 + 페이징
    public Map<String, Object> getFilteredSearchedPagedProducts(
            String brand, String gender, String volume, String keyword, List<ProductStatus> statuses, int page, int size) {
        List<Product> all = productRepository.searchFilteredList(brand, gender, volume, keyword, statuses);

        int fromIndex = Math.max((page - 1) * size, 0);
        int toIndex = Math.min(fromIndex + size, all.size());
        List<Product> paged = all.subList(fromIndex, toIndex);

        List<ProductResponseDTO> content = paged.stream().map(ProductResponseDTO::new).toList();

        return Map.of(
                "content", content,
                "totalElements", all.size(),
                "page", page,
                "size", size,
                "totalPages", (int) Math.ceil((double) all.size() / size)
        );
    }

    public ProductResponseDTO createProduct(ProductRequestDTO dto) {
        Product product = new Product();

        product.setName(dto.getName());
        product.setBrand(dto.getBrand());
        product.setGenderCategory(dto.getGenderCategory());
        product.setVolumeCategory(dto.getVolumeCategory());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());
        product.setImageUrl(dto.getImageUrl());
        product.setDescription(dto.getDescription());
        product.setCreatedAt(LocalDateTime.now());

        product.setStatus(resolveStatus(dto));

        return new ProductResponseDTO(productRepository.save(product));
    }

    public ProductResponseDTO getProductById(Long id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));
        return new ProductResponseDTO(product);
    }

    public ProductResponseDTO updateProduct(Long id, ProductRequestDTO dto) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        product.setName(dto.getName());
        product.setBrand(dto.getBrand());
        product.setGenderCategory(dto.getGenderCategory());
        product.setVolumeCategory(dto.getVolumeCategory());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());
        product.setImageUrl(dto.getImageUrl());
        product.setDescription(dto.getDescription());

        product.setStatus(resolveStatus(dto));

        return new ProductResponseDTO(productRepository.save(product));
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("상품이 존재하지 않습니다."));

        product.setStatus(ProductStatus.DELETED);
        productRepository.save(product);
    }

    // 브랜드 목록 조회
    public List<String> getAllBrands() {
        return productRepository.findAll().stream()
                .map(Product::getBrand)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    // product 테이블의 status만 중점적으로 수정하는 메서드
    public void updateProductStatus(Long productId, ProductStatus newStatus) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        // 유효성 검증: 재고가 0인데 ACTIVE로 설정하면 안 됨
        if (product.getStock() == 0 && newStatus == ProductStatus.ACTIVE) {
            throw new IllegalArgumentException("재고가 0이면 상품 상태를 ACTIVE로 설정할 수 없습니다.");
        }

        product.setStatus(newStatus);
        productRepository.save(product);
    }

    private ProductStatus resolveStatus(ProductRequestDTO dto) {
        if(dto.getStatus() != null) {
            if(dto.getStock() == 0 && dto.getStatus() == ProductStatus.ACTIVE) {
                throw new IllegalArgumentException("재고가 0이면 상품 상태가 ACTIVE일 수 없습니다.");
            }
            return dto.getStatus();
        } else {
            return dto.getStock() == 0 ? ProductStatus.SOLD_OUT : ProductStatus.ACTIVE;
        }
    }
}
