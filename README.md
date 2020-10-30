
🛑 En desarrollo❗️❗️❗️❗️ 🛑

# Librería Javascript - API de Administración Tributaria Virtual (ATV) del Ministerio de Hacienda.

[![Code Coverage][codecovimg]][codecov]

Buscando colaboradores

## Descripción
Este proyecto tiene como fin facilitar la creación de la factura electrónica de Costa Rica. La idea es simplificar el proceso y que está librería pueda ser utilizada como ayuda en otros proyectos que requieran el acceso al sistema de hacienda. Para esto ofrece herramienta para conectarse al API del Ministerio de Hacienda de Costa Rica.


## Testing
Para probar las funcionalidades se recomienda crear un .env en donde se especifiquen datos de prueba.
```
USERNAME_TEST=
PASSWORD_TEST=
IS_STG=
SOURCE_JSON_URI=
```

Para probar getToken
```
ts-node --require dotenv/config test/getToken.ts
```
Generar la clave
```
ts-node --require dotenv/config test/getClave.ts

Para probar getXML
```
ts-node --require dotenv/config test/genXML.ts
```
Para probar genJsonHeaderXML
```
ts-node --require dotenv/config test/genBasicXML.ts
```
