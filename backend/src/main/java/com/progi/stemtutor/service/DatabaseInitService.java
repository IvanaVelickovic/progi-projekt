package com.progi.stemtutor.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class DatabaseInitService {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseInitService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void insertSubjects() {
        jdbcTemplate.update("INSERT INTO subjects (subject_name) VALUES (?)", "Matematika");
        jdbcTemplate.update("INSERT INTO subjects (subject_name) VALUES (?)", "Fizika");
        jdbcTemplate.update("INSERT INTO subjects (subject_name) VALUES (?)", "Informatika");
    }
}
