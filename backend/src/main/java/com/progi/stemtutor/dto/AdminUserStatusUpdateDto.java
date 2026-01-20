package com.progi.stemtutor.dto;

import com.progi.stemtutor.model.enums.UserStatus;
import lombok.Data;

@Data
public class AdminUserStatusUpdateDto {
    private String status; // 'active', 'inactive', 'banned'
}
