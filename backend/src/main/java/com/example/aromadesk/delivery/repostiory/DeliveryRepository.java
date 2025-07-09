package com.example.aromadesk.delivery.repostiory;

import com.example.aromadesk.delivery.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
}
