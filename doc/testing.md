## Testing
Configurar .env file basado en .env.example

```
cp .env.example .env
```

Para probar las funcionalidades se recomienda crear un .env en donde se especifiquen datos de prueba.
```
USERNAME_TEST= ## Provided be ATV System
PASSWORD_TEST= ## Provided be ATV System
IS_STG=1
SOURCE_P12_URI= ## Provided be ATV System
SOURCE_P12_PASSPORT= ## Provided be ATV System
SOURCE_URI_XML_OUTPUT= ## Custom OS PATH
XML_TO_CONFIRM= ## Custom OS PATH
```
Example:
```
USERNAME_TEST=USER@stag.comprobanteselectronicos.go.cr
PASSWORD_TEST=PASSWORD_PROVIDED_BY_ATV
IS_STG="1"
SOURCE_P12_URI=$PATH/#####.p12
SOURCE_P12_PASSPORT=1234
SOURCE_URI_XML_OUTPUT=$PATH/__test__/output/output.xml
XML_TO_CONFIRM=$PATH/__test__/input/Comprobante_Electronico_####_####.xml
```
