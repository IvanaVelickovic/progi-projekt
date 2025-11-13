package com.progi.stemtutor.config;

import com.progi.stemtutor.repository.UserRepository;
import com.progi.stemtutor.service.JwtService;
import com.progi.stemtutor.service.CustomOAuth2UserService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

@EnableWebSecurity
@Configuration
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final CustomOAuth2UserService oAuth2UserService;
    private final HandlerExceptionResolver handlerExceptionResolver;

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(
            HandlerExceptionResolver handlerExceptionResolver,
            JwtService jwtService,
            UserDetailsService userDetailsService
    ) {
        return new JwtAuthenticationFilter(handlerExceptionResolver, jwtService, userDetailsService);
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return email -> userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        var authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }


    @Bean
    @SneakyThrows
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtService jwtService) throws Exception {
        http
                // Onemogućavanje CSRF-a
                .csrf(AbstractHttpConfigurer::disable)

                // Konfiguracija dozvola za putanje
                .authorizeHttpRequests(auth -> auth
                        // Dozvolite pristup putanjama za prijavu i OAuth2 flow
                        .requestMatchers("/auth/**", "/oauth2/**", "/login/**").permitAll()
                        // Sve ostale putanje zahtijevaju autentikaciju (npr. /api/users)
                        .anyRequest().authenticated()
                )

                // Upravljanje sesijama: Postavljamo na STATELESS
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter(handlerExceptionResolver, jwtService, userDetailsService()), UsernamePasswordAuthenticationFilter.class)
                // OAuth 2.0 Login konfiguracija
                .oauth2Login(oauth2 -> oauth2
                        // 1. Obrada korisničkih podataka: Povezivanje vašeg servisa
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(oAuth2UserService)
                        )
                        // 2. Obrada uspješne prijave: Povezivanje vašeg handlera (generiranje JWT-a)
                        .successHandler(oAuth2SuccessHandler)
                );

        return http.build();
    }
}