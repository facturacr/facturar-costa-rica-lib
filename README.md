
🛑 En desarrollo❗️❗️❗️❗️ 🛑

# Librería Javascript - API de Administración Tributaria Virtual (ATV) del Ministerio de Hacienda.

[![Code Coverage][codecovimg]][codecov]

Buscando colaboradores

## Descripción
Este proyecto tiene como fin facilitar la creación de la factura electrónica de Costa Rica. La idea es simplificar el proceso y que está librería pueda ser utilizada como ayuda en otros proyectos que requieran el acceso al sistema de hacienda. Para esto ofrece herramienta para conectarse al API del Ministerio de Hacienda de Costa Rica.

##

## Testing
Para probar las funcionalidades se recomienda crear un .env en donde se especifiquen datos de prueba.
```
USERNAME_TEST=
PASSWORD_TEST=
IS_STG=1
SOURCE_P12_URI=
SOURCE_P12_PASSPORT=
SOURCE_URI_XML_OUTPUT=
XML_TO_CONFIRM=
```

Para probar crear y enviar factura
```
ts-node --require dotenv/config test/createAndSend.ts
```

Para probar genJson HeaderXML
```
ts-node --require dotenv/config test/genBasicXML.ts
```

Generar la clave
```
ts-node --require dotenv/config test/getClave.ts
```

Para crear una nota de credito
```
ts-node --require dotenv/config test/createCreditNote.ts
```

## Tools
Para usar readXML establecer en .env
```
SOURCE_URI=
```
