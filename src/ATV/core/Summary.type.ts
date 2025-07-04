export type SummaryProps = {
  currency?: {
    code: string;
    exchangeRate: string;
  };
  totalTaxedServices: number; // TotalServGravados
  totalExemptServices: number; // TotalServExentos
  totalEncumberedServices: number; // TotalServExonerado
  totalExemptMerchandise?: number; // TotalMercanciasGravadas
  totalEncumberedMerchandise?: number; // TotalMercanciasExentas
  totalEncumbered: number; // TotalGravado
  totalTaxed?: number;
  totalExempt: number; // TotalExento
  totalExonerated: number; // TotalExonerado
  totalSale: number; // TotalVenta
  totalDiscounts?: number; // TotalDescuentos
  totalNetSale?: number; // TotalVentaNeta
  totalTaxes: number; // TotalImpuesto
  totalTaxBreakdown?: Array<{
    code: string; // Codigo
    taxRateCode?: string; // CodigoTarifaIVA
    totalTaxAmount: number; // TotalMontoImpuesto
  }>; // TotalDesgloseImpuesto
  totalVoucher: number; // TotalComprobante
}
