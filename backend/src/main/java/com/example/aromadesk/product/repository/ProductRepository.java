package com.example.aromadesk.product.repository;

import com.example.aromadesk.product.entity.Product;
import com.example.aromadesk.product.entity.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 *
 */
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("""
        SELECT p FROM Product p
        WHERE p.status IN :statuses
        AND (:brand IS NULL OR p.brand = :brand)
        AND (:gender IS NULL OR p.genderCategory = :gender)
        AND (:volume IS NULL OR p.volumeCategory = :volume)
    """)
    List<Product> findFilteredList(@Param("statuses")List<ProductStatus> statuses, @Param("brand")String brand, @Param("gender")String gender, @Param("volume")String volume);

    @Query("SELECT p FROM Product p " +
            "WHERE (:statuses IS NULL OR p.status IN :statuses)" +
            "AND (:brand IS NULL OR p.brand = :brand) " +
            "AND (:gender IS NULL OR p.genderCategory = :gender) " +
            "AND (:volume IS NULL OR p.volumeCategory = :volume) " +
            "AND (:keyword IS NULL OR " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) )")
    List<Product> searchFilteredList(@Param("brand") String brand,
                                     @Param("gender") String gender,
                                     @Param("volume") String volume,
                                     @Param("keyword") String keyword,
                                     @Param("statuses") List<ProductStatus> statuses);
}
