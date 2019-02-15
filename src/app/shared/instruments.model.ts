export class Instruments {

  constructor(public code?: string,
              public nom?: string,
              public codeSocieteGestion?: string,
              public statut?: string,
              public nature?: string,
              public classification?: string,
              public codeEmploiRevenu?: string,
              public periodicite?: string,
              public precisionPart?: number,
              public precisionVL?: number,
              public precisionPlusValue?: number,
              public cutOffStp?: any,
              public idDevise?: string,
              public niveauRisque?: number,
              public horizonPlacement?: number,
              public cutOff?: any,
              public cutOffFax?: any,
              public codeFundLife?: string,
              public idPlateforme?: string,
              public idSocieteGestion?: number,
              public idDepositaire?: number,
              public idAgentTransfert?: number){}
}
