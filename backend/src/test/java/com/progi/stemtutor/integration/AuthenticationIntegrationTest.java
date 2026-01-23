package com.progi.stemtutor.integration;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.Matchers.is;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean; // NOVI STANDARDI
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.progi.stemtutor.dto.LoginRequest;
import com.progi.stemtutor.dto.SignupRequest;
import com.progi.stemtutor.repository.UserRepository;
import com.progi.stemtutor.service.EmailService;
import com.progi.stemtutor.service.GoogleCalendarService;
import com.progi.stemtutor.service.JaaSTokenService;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthenticationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    // Koristimo MockitoBean za vanjske servise koje ne želimo stvarno zvati
    @MockitoBean
    private GoogleCalendarService googleCalendarService;

    @MockitoBean
    private JaaSTokenService jaaSTokenService;

    @MockitoBean
    private EmailService emailService;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void testSignupAndLoginFlow() throws Exception {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("marinovrgoc@example.com");
        signupRequest.setPassword("StrongPass1!");
        signupRequest.setFirstName("Integration");
        signupRequest.setLastName("User");

        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(is("marinovrgoc@example.com")));

        assertTrue(userRepository.findByEmail("marinovrgoc@example.com").isPresent());

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("marinovrgoc@example.com");
        loginRequest.setPassword("StrongPass1!");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.token").isString());
    }

    @Test
    void testLoginWithInvalidPassword() throws Exception {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("fail@example.com");
        signupRequest.setPassword("StrongPass1!");
        signupRequest.setFirstName("Fail");
        signupRequest.setLastName("User");

        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk());

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("fail@example.com");
        loginRequest.setPassword("WrongPass1");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }
}