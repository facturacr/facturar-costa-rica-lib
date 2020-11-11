# Ejemplos con implementaciones para pruebas

Para probar crear y enviar factura
```
ts-node -r tsconfig-paths/register test/examples/createAndSend.ts
--require dotenv/config test/examples/createAndSend.ts
```

Para probar genJson HeaderXML
```
ts-node -r tsconfig-paths/register test/examples/createAndSend.ts
--require dotenv/config test/examples/genBasicXML.ts
```

Generar la clave
```
ts-node -r tsconfig-paths/register test/examples/createAndSend.ts
 --require dotenv/config test/examples/getClave.ts
```

Para crear una nota de credito
```
ts-node -r tsconfig-paths/register test/examples/createAndSend.ts
 --require dotenv/config test/examples/createCreditNote.ts
```

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

## Tools
Para usar readXML establecer en .env
```
SOURCE_URI=
```