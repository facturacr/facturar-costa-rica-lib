Gemini generated output 

## Campos Agregados para Todos los Comprobantes
Se incluye el campo de "Proveedor de Sistemas" para identificar los sistemas de emisión de comprobantes electrónicos.    

Se incluye el campo de "Código de actividad económica del receptor".    

Se ajusta la condición del nodo "Código y Tipo de Moneda" a obligatorio en todos los comprobantes.

## Campos Ajustados para Todos los Documentos
Se ajusta la descripción del nodo "Detalle del Servicio, Mercancía u otro" aclarando la condicionalidad de su uso obligatorio en el comprobante Factura Electrónica, excepto cuando se use se seleccione el código 04, 08, 09 y 10 de la nota 16 en el campo "Tipo de documento otros cargos" y no cuente con una línea de servicio o producto.    

Se ajusta la condición del campo "Detalle de la mercancía transferida o servicio prestado" a obligatorio en todos los comprobantes.    

Se ajusta la descripción sobre el cálculo del campo "Impuesto Neto" incorporando la resta del monto del campo "Impuestos Asumidos por el Emisor o cobrado a Nivel de Fábrica".    

Se ajusta la descripción sobre el cálculo del campo "Total por Línea de Detalle" considerando únicamente la sumatoria entre el "Subtotal" y el "Impuesto Neto" en las reglas de cálculo.    

## Campos Agregados Solo para Algunos Comprobantes
Se incluye en la nota 4 el código 05 para el tipo de identificación "Extranjero No Domiciliado", junto con nota explicativa al pie de página.    

Se ajusta la descripción y se amplía el tamaño del campo "Número de cédula física/ juridica/NITE/DIMEX/Extranjero No domiciliado/No contribuyente, del emisor" a 20 caracteres cuando se use el código 05 de la nota 4.    

Se incluye el campo de "Registro fiscal de bebidas Alcohólicas Ley 8707".    

Se incluye el campo "Detalle Condición de la Venta OTRO" de uso obligatorio en caso de utilizar el código 99 de "Otros" de la nota 5.    

Se incluye el Nodo de "Detalle de Productos del Surtido" que será de condición obligatoria para cuando se utilicen códigos CABYS de combos/surtidos/paquetes, junto con nota explicativa al pie de página.    

Se incluye la nota 20 para los tipos de descuentos a utilizar en el campo de "Código del Descuento".    

Se incluye el campo "Código del descuento" de condición obligatoria para la identificación de los descuentos detallados en la nota 20.    

Se incluye el campo "Tipo de documento de exoneración o de autorización OTRO" de uso obligatorio en caso de utilizar el código 99 de "Otros" de la nota 10.1.    

Se incluye el campo "Número de artículo que establece la exoneración o autorización" que será de condición obligatoria cuando se usen los códigos 02, 03 o 08 de la nota 10.1.    

Se incluye el campo "Número de inciso que establece la exoneración o autorización" que será de condición obligatoria cuando se use el campo "Número de artículo que establece la exoneración o autorización".    

Se incluye el campo "Nombre Institución Otros que será de condición obligatoria en el caso de utilizar el código 99 de "OTRO" de la nota 23.    

Se incluye el campo "Tipo de documento OTRO" de uso obligatorio en caso de utilizar el código 99 de "Otros" de la nota 16.    

Se crea anidamiento para la identificación del tercero e incluye el campo denominado "Tipo de identificación del Tercero" al nodo de "Otros Cargos".    

Se incluye el nodo "Total Desglose por Impuesto Cobrado" con la explicación sobre el cálculo del campo.    

## Campos Ajustados para Algunos Documentos
Se ajusta la condición del nodo "Identificación del Receptor" en factura electrónica de exportación a obligatorio.    

Se ajusta la descripción y se amplía el tamaño del campo "Número de cédula física/jurídica/NITE/DIMEX/Extranjero No domiciliado, del receptor" a 20 caracteres.    

Se ajusta la descripción y condición del campo "Tipo de Cambio" a obligatorio en los comprobantes "Nota de Crédito Electrónica" y "Nota de Débito Electrónica".  