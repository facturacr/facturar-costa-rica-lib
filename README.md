
🛑 En desarrollo❗️❗️❗️❗️ 🛑

Buscando colaboradores

## Descripción
Este proyecto tiene como fin facilitar la creación de la factura electrónica de Costa Rica. La idea es simplificar el proceso y que está librería pueda ser utilizada como ayuda en otros proyectos que requieran el acceso al sistema de hacienda. Para esto ofrece herramienta para conectarse al API del Ministerio de Hacienda de Costa Rica.

##

## Testing
Para probar las funcionalidades se recomienda crear un .env en donde se especifiquen datos de prueba.
```
USERNAME_TEST=
PASSWORD_TEST=
IS_STG=
SOURCE_P12_URI=
SOURCE_P12_PASSPORT=
```

Crear factura de prueba en ```test/input/frontendRequest.ts```(necesario para pruebas finales).

Ejemplo de estructura
```
import { FrontEndRequest } from '../../src/types/globalInterfaces'
const request: FrontEndRequest = {
  Emisor: {
    Nombre: 'Nombre Emisor',
    Identificacion: {
      Numero: '123456789101'
    }
  },
  Receptor: {
    Nombre: 'Nombre Receptor',
    Identificacion: {
      Numero: '123456789101'
    }
  },
  sucursal: '001',
  terminal: '00001',
  tipoDocumento: 'FE',
  codigoPais: '506',
  consecutivo: '0000000001',
  codigoSeguridad: '00000001',
  situationEC: '1',
  total: 1000,
  actividad: 4,
  impuesto: 100
}

export default request
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
