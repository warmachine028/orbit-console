package com.orbit.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RecordRequest {
    @NotBlank private String name;
    @NotBlank private String category;
    @NotBlank private String status;
}
