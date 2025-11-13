package com.progi.stemtutor.controller;


import com.progi.stemtutor.dto.LoginRequest;
import com.progi.stemtutor.dto.SignupRequest;
import com.progi.stemtutor.model.User;
import com.progi.stemtutor.responses.LoginResponse;
import com.progi.stemtutor.service.AuthenticationService;
import com.progi.stemtutor.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {
    private final JwtService jwtService;

    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signup")
    public ResponseEntity<User> register(@RequestBody SignupRequest signupRequest) {
        User registeredUser = authenticationService.signup(signupRequest);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginRequest loginRequest){
        User authenticatedUser = authenticationService.authenticate(loginRequest);
        String jwtToken = jwtService.generateToken(authenticatedUser);
        LoginResponse loginResponse = new LoginResponse(jwtToken);
        return ResponseEntity.ok(loginResponse);
    }

}