package com.progi.stemtutor.service;

import org.bouncycastle.asn1.pkcs.RSAPrivateKey;
import org.bouncycastle.asn1.pkcs.PrivateKeyInfo;
import org.bouncycastle.asn1.ASN1Sequence;
import org.bouncycastle.asn1.ASN1Primitive;
import org.bouncycastle.openssl.PEMParser;
import org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;
import org.springframework.stereotype.Component;

import java.io.StringReader;
import java.security.PrivateKey;

@Component
public class RSAKeyUtils {

    public PrivateKey parsePKCS1PrivateKey(String pem) throws Exception {
        pem = pem.replace("-----BEGIN RSA PRIVATE KEY-----", "")
                .replace("-----END RSA PRIVATE KEY-----", "")
                .replaceAll("\\s+", "");

        byte[] decoded = java.util.Base64.getDecoder().decode(pem);

        ASN1Sequence primitive = (ASN1Sequence) ASN1Primitive.fromByteArray(decoded);
        RSAPrivateKey rsaPrivateKey = RSAPrivateKey.getInstance(primitive);

        PrivateKeyInfo keyInfo = new PrivateKeyInfo(
                new org.bouncycastle.asn1.x509.AlgorithmIdentifier(
                        org.bouncycastle.asn1.pkcs.PKCSObjectIdentifiers.rsaEncryption),
                rsaPrivateKey);

        return new JcaPEMKeyConverter().getPrivateKey(keyInfo);
    }
}
