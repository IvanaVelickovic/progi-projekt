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
import java.util.HashMap;

@Service
public class JaaSTokenService {

    @Value("${jitsi.jaas.app-id}")
    private String appId;

    @Value("${jitsi.jaas.kid}")
    private String kid;

    public JaaSTokenResponse generateToken(String roomName, String displayName, boolean isInstructor) throws Exception {
        PrivateKey privateKey = loadPrivateKeyFromFile("jitsi_private_key.pem");

        Instant now = Instant.now();
        Instant exp = now.plusSeconds(3600);

        String jwt = Jwts.builder()
                .setHeaderParam("kid", kid)
                .setIssuer("chat")
                .setAudience("jitsi")
                .setSubject(appId)
                .claim("room", roomName)
                .claim("context", new HashMap<String, Object>() {{
                    put("user", new HashMap<String, Object>() {{
                        put("name", displayName);
                        put("moderator", isInstructor);
                    }});
                }})
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(exp))
                .signWith(privateKey, SignatureAlgorithm.RS256)
                .compact();

        // Vraća točno tri polja koja si tražio
        return new JaaSTokenResponse(roomName, appId, jwt);
    }

    private PrivateKey loadPrivateKeyFromFile(String resourceName) throws Exception {
        String pem = new String(Files.readAllBytes(Paths.get(getClass()
                .getClassLoader()
                .getResource(resourceName).toURI())));

        try (PEMParser parser = new PEMParser(new StringReader(pem))) {
            Object obj = parser.readObject();
            JcaPEMKeyConverter converter = new JcaPEMKeyConverter();
            if (obj instanceof PrivateKeyInfo) {
                return converter.getPrivateKey((PrivateKeyInfo) obj);
            } else {
                return converter.getKeyPair((PEMKeyPair) obj).getPrivate();
            }
        }
    }
}