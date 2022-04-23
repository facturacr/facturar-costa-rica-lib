export const tipoDocumento = {
  '01': {
    desc: 'Impuesto General sobre las Ventas'
  },
  '02': {
    desc: 'Impuesto Selectivo de Consumo'
  },
  '03': {
    desc: 'Impuesto Único a los combustibles'
  },
  '04': {
    desc: 'Impuesto específico de Bebidas Alcohólicas'
  },
  '05': {
    desc: 'Impuesto   Específico   sobre   las   bebidas   envasadas   sin contenido alcohólico y jabones de tocador.'
  },
  '06': {
    desc: 'Impuesto a los Productos de Tabaco'
  },
  '07': {
    desc: 'Servicio'
  }
}

// Código del impuesto
export const enumImpuestoTypeCodigo = [
  '01', // Impuesto al valor agregado
  '02', // Impuesto Selectivo de Consumo
  '03', // Impuesto único a los combustivos
  '04', // Impuesto específico de bebidas alcohólicas
  '05', // Impuesto específico sobre las bebidas envasadas sin contenido alcohólico y jabones de tocador
  '06', // Impuesto a los productos de tabaco
  '07', // IVA (cálculo especial)
  '08', // IVA Regimen de Bienes Usados (Factor)
  '12', // Impuesto Especifico al cemento
  '99' // Otros
]

// Código de la tarifa del impuesto.
export const enumImpuestoTypeCodigoTarifa = [
  '01', // Tarifa 0% (Exento),
  '02', // Tarifa Reducida 1%
  '03', // Tarifa reducida 2%
  '04', // Tarifa reducida 4%
  '05', // Transitorio 0%
  '06', // Transitorio 4%
  '07', // Transitorio 8%
  '08' // Tarifa General 13%
]
