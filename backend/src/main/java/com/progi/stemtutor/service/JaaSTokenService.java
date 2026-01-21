package com.progi.stemtutor.service;

import com.progi.stemtutor.dto.JaaSTokenResponse;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.bouncycastle.asn1.pkcs.PrivateKeyInfo;
import org.bouncycastle.openssl.PEMKeyPair;
import org.bouncycastle.openssl.PEMParser;
import org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.StringReader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.PrivateKey;
import java.time.Instant;
import java.util.Date;

@Service
public class JaaSTokenService {

    @Value("${jitsi.jaas.app-id}")
    private String appId;

    @Value("${jitsi.jaas.kid}")
    private String kid;

    public JaaSTokenResponse generateToken(String roomName, String displayName, boolean isInstructor) throws Exception {
        // učitaj privatni ključ iz fajla
        PrivateKey privateKey = loadPrivateKeyFromFile("jitsi_private_key.pem");

        Instant now = Instant.now();
        Instant exp = now.plusSeconds(3600); // 1h

        String jwt = Jwts.builder()
                .setHeaderParam("kid", kid)
                .setIssuer("chat")
                .setAudience("jitsi")
                .setSubject(appId)
                .claim("room", roomName)
                .claim("context", new java.util.HashMap<>() {{
                    put("user", new java.util.HashMap<>() {{
                        put("name", displayName);
                        put("moderator", isInstructor);
                    }});
                }})
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(exp))
                .signWith(privateKey, SignatureAlgorithm.RS256)
                .compact();

        return new JaaSTokenResponse(roomName, displayName, isInstructor, jwt);
    }

    // funkcija koja učitava ključ iz resources
    private PrivateKey loadPrivateKeyFromFile(String resourceName) throws Exception {
        String pem = new String(Files.readAllBytes(Paths.get(getClass()
                .getClassLoader()
                .getResource(resourceName).toURI())));

        try (PEMParser parser = new PEMParser(new StringReader(pem))) {
            Object obj = parser.readObject();
            if (obj == null) throw new IllegalArgumentException("Private key PEM is empty or invalid!");
            JcaPEMKeyConverter converter = new JcaPEMKeyConverter();
            if (obj instanceof PrivateKeyInfo) {
                return converter.getPrivateKey((PrivateKeyInfo) obj);
            } else if (obj instanceof PEMKeyPair) {
                return converter.getKeyPair((PEMKeyPair) obj).getPrivate();
            } else {
                throw new IllegalArgumentException("Unsupported key format: " + obj.getClass());
            }
        }
    }
}
