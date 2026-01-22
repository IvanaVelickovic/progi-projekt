package com.progi.stemtutor.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.progi.stemtutor.config.JitsiProperties;
import com.progi.stemtutor.model.Reservation;
import com.progi.stemtutor.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.StringReader;
import java.security.KeyFactory;
import java.security.interfaces.RSAPrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class JitsiJwtService {

    private final JitsiProperties props;

    public String generate(User user, Reservation reservation) throws Exception {
        RSAPrivateKey privateKey = parsePrivateKey(props.getJaas().getPrivateKey());

        Instant now = Instant.now();

        return JWT.create()
                .withIssuer(props.getJaas().getAppId())
                .withAudience("jitsi")
                .withClaim("sub", props.getJaas().getAppId())
                .withClaim("room", "stemtutor-reservation-" + reservation.getId())
                .withClaim("moderator", user.getRole().name().equalsIgnoreCase("instructor"))
                .withClaim("context", Map.of(
                        "user", Map.of(
                                "name", user.getFirstName() + " " + user.getLastName()
                        )
                ))
                .withIssuedAt(now)
                .withExpiresAt(now.plusSeconds(3600))
                .sign(Algorithm.RSA256(null, privateKey));
    }

    private RSAPrivateKey parsePrivateKey(String key) throws Exception {
        String pem = key
                .replace("-----BEGIN RSA PRIVATE KEY-----", "")
                .replace("-----END RSA PRIVATE KEY-----", "")
                .replaceAll("\\s+", "");
        byte[] decoded = Base64.getDecoder().decode(pem);
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(decoded);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        return (RSAPrivateKey) kf.generatePrivate(spec);
    }
}
