package com.example.aromadesk.member.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * @author : young
 * @packageName : com.example.aromadesk.member.dto
 * @fileName : UpdateAddressDto
 * @date : 25. 6. 30.
 * @see
 **/

@Getter
@Setter
public class UpdateAddressDto {
    private String address;
    private String zipCode;
    private String addressDetail;
}
