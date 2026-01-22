package com.progi.stemtutor.controller;

import com.progi.stemtutor.dto.SessionSummaryDto;
import com.progi.stemtutor.model.User;
import com.progi.stemtutor.service.SessionSummaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/student")
public class StudentSummaryController {

    private final SessionSummaryService summaryService;

    @GetMapping("/summaries")
    public List<SessionSummaryDto> studentSummaries(
            @AuthenticationPrincipal User user
    ) {
        return summaryService.studentSummaries(user);
    }
}

