export enum AceptationStates {
    ACCEPTED = 1,
    PARTIALLY_ACCEPTED = 2,
    DECLINED = 3
}

export type ReceptorMessageProps = {
    clave: string;
    emitterIdentifier: string;
    emitterIdentifierType: string;
    receptorIdentifier: string;
    receptorIdentifierType: string;
    documentIssueDate: Date;
    activityCode: string;
    aceptationState: AceptationStates
    aceptationDetailMessage: string;
    receptorConcecutive: string;
    taxCondition: string;
    totalTaxes: number;
    totalSale: number;
}
