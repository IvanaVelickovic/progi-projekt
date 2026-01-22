package com.progi.stemtutor.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "jitsi")
@Getter @Setter
public class JitsiProperties {
    private String mode = "public"; // public ili jaas
    private String domain = "meet.jit.si";

    private Jaas jaas = new Jaas();

    public boolean isJaas() {
        return "jaas".equalsIgnoreCase(mode);
    }

    @Getter @Setter
    public static class Jaas {
        private String appId;
        private String kid;
        private String privateKey; // RSA PRIVATE KEY
    }
}
