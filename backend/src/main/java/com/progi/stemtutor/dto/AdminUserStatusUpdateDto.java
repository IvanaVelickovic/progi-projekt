package com.progi.stemtutor.dto;

import lombok.Data;

@Data
public class AdminUserStatusUpdateDto {
    private String status; // 'active', 'inactive', 'banned'
}
