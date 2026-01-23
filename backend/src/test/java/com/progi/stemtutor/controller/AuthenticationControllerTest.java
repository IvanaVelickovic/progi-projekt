package com.progi.stemtutor.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.hamcrest.Matchers.is;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.progi.stemtutor.dto.LoginRequest;
import com.progi.stemtutor.dto.SignupRequest;
import com.progi.stemtutor.model.User;
import com.progi.stemtutor.service.AuthenticationService;
import com.progi.stemtutor.service.JwtService;

@WebMvcTest(AuthenticationController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthenticationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthenticationService authenticationService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testRegister_Success() throws Exception {
        SignupRequest request = new SignupRequest();
        request.setEmail("markohorvat@example.com");
        request.setPassword("StrongPass1!");
        request.setFirstName("Marko");
        request.setLastName("Horvat");

        User user = new User();
        user.setEmail("markohorvat@example.com");
        user.setFirstName("Marko");
        user.setLastName("Horvat");

        when(authenticationService.signup(any(SignupRequest.class))).thenReturn(user);

        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(is("markohorvat@example.com")))
                .andExpect(jsonPath("$.firstName").value(is("Marko")));
    }

    @Test
    void testAuthenticate_Success() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("markohorvat@example.com");
        request.setPassword("StrongPass1!");

        User user = new User();
        user.setEmail("markohorvat@example.com");

        when(authenticationService.authenticate(any(LoginRequest.class))).thenReturn(user);
        when(jwtService.generateToken(user)).thenReturn("mocked-jwt-token");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                // Korištenje is(...) osigurava stabilnost testa
                .andExpect(jsonPath("$.token").value(is("mocked-jwt-token")));
    }
}