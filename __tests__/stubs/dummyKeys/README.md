## Steps for generating P12 dummy key

1. Generate 2048-bit RSA private key:

    ``` openssl genrsa -out key.pem 2048 ```

2. Generate a Certificate Signing Request:

    ``` openssl req -new -sha256 -key key.pem -out csr.csr ```

3. Generate a self-signed x509 certificate suitable for use on web servers:

    ``` openssl req -x509 -sha256 -days 365 -key key.pem -in csr.csr -out certificate.pem ```

4. Create SSL identity file in PKCS12 using pasword 1234:

    ``` openssl pkcs12 -export -out client-identity.p12 -inkey key.pem -in certificate.pem ```

Source: https://stackoverflow.com/a/65709104/2272082
