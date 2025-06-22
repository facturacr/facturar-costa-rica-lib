# Ejemplos con implementaciones para pruebas
Asegurate de ejecutar la configuración inicial del proyecto.

Para probar crear y enviar factura electronica. Ejemplo:
```
yarn ts-node -r tsconfig-paths/register --require dotenv/config examples/createAndSendFE.ts 1
```

Para probar crear y enviar tiquete electronico. Ejemplo:
```
yarn ts-node -r tsconfig-paths/register --require dotenv/config examples/createAndSendTE.ts 1
```

Para aceptar una factura. Ejemplo:
```
yarn ts-node -r tsconfig-paths/register --require dotenv/config examples/atvAccept.ts
```

Para crear y enviar una nota de credito. Ejemplo:
```
yarn ts-node -r tsconfig-paths/register --require dotenv/config examples/createCreditNote.ts
```

Para probar genJson HeaderXML. Ejemplo:
```
yarn ts-node -r tsconfig-paths/register --require dotenv/config examples/genBasicXML.ts
```

Generar la clave. Ejemplo:
```
yarn ts-node -r tsconfig-paths/register--require dotenv/config examples/getClave.ts
```

Para obtener un token. Ejemplo:
```
yarn ts-node -r tsconfig-paths/register --require dotenv/config examples/getToken.ts
```

## Tools
Para usar readXML establecer en .env
```
SOURCE_URI=
```
