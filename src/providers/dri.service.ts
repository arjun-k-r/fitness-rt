import { Injectable } from '@angular/core';

@Injectable()
export class DRIService {

  constructor() { }

  public getALADri(energyConsumption: number): number {
    return 0.03 * energyConsumption;
  }

  public getAlcoholDri(age: number): number {
    return age > 18 ? 10 : 0;
  }

  public getArginineDri(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
    if (age <= 1) {
      return 200 * weight;
    } else if (age <= 14) {
      return 60 * weight;
    } else if (gender === 'male') {
      return 40 * weight;
    } else {
      return lactating ? 100 * weight : pregnant ? 100 * weight : 40 * weight;
    }
  }

  public getBiotinDri(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (age <= 1) {
      return 0.006;
    } else if (age <= 14) {
      return 0.02;
    } else if (gender === 'male') {
      return 0.03;
    } else {
      return lactating ? 0.35 : pregnant ? 0.03 : 0.03;
    }
  }

  public getCaffeine(age: number): number {
    return age > 14 ? 300 : 0;
  }

  public getCalciumDri(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (age <= 1) {
      return 260;
    } else if (age <= 14) {
      return 1000;
    } else if (gender === 'male') {
      return 1200;
    } else {
      return lactating ? 1300 : pregnant ? 1300 : 1200;
    }
  }

  public getCarbDri(energyConsumption: number): number {
    return 0.5 * energyConsumption;
  }

  public getChlorideDri(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (age <= 1) {
      return 1000;
    } else if (age <= 14) {
      return 1700;
    } else {
      return 2300;
    }
  }

  public getCholineDri(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (age <= 1) {
      return 150;
    } else if (age <= 14) {
      return 350;
    } else if (gender === 'male') {
      return 550;
    } else {
      return lactating ? 550 : pregnant ? 450 : 425;
    }
  }

  public getChromiumDri(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (age <= 1) {
      return 0.0055;
    } else if (age <= 14) {
      return 0.025;
    } else if (gender === 'male') {
      return 0.035;
    } else {
      return lactating ? 0.04 : pregnant ? 0.03 : 0.025;
    }
  }

  public getCobalaminDri(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (age <= 1) {
      return 0.0005;
    } else if (age <= 14) {
      return 0.0018;
    } else if (gender === 'male') {
      return 0.0024;
    } else {
      return lactating ? 0.0028 : pregnant ? 0.0026 : 0.0024;
    }
  }

  public getCopperDri(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (age <= 1) {
      return 0.22;
    } else if (age <= 14) {
      return 0.7;
    } else if (gender === 'male') {
      return 0.9;
    } else {
      return lactating ? 1.3 : pregnant ? 1 : 0.9;
    }
  }

  public getDHADri(energyConsumption: number): number {
    return 0.005 * energyConsumption;
  }

  public getEPADri(energyConsumption: number): number {
    return 0.005 * energyConsumption;
  }

  public getFatDri(energyConsumption: number): number {
    return 0.3 * energyConsumption;
  }

  public getFiberDri(weight: number): number {
    return weight;
  }

  public getFolicAcidDri(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (age <= 1) {
      return 0.08;
    } else if (age <= 14) {
      return 0.3;
    } else if (gender === 'male') {
      return 0.4;
    } else {
      return lactating ? 0.6 : pregnant ? 0.8 : 0.4;
    }
  }

  public getHistidineDri(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
    if (age <= 1) {
      return 36 * weight;
    } else if (age <= 14) {
      return 16 * weight;
    } else if (gender === 'male') {
      return 15 * weight;
    } else {
      return lactating ? 20 * weight : pregnant ? 20 * weight : 14 * weight;
    }
  }

  public getIodineDri(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (age <= 1) {
      return 0.13;
    } else if (age <= 14) {
      return 0.13;
    } else if (gender === 'male') {
      return 0.15;
    } else {
      return lactating ? 0.29 : pregnant ? 0.22 : 0.15;
    }
  }

  public getIronDri(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (age <= 1) {
      return 11;
    } else if (age <= 14) {
      return 10;
    } else if (gender === 'male') {
      return 8;
    } else {
      return lactating ? 10 : pregnant ? 27 : 10;
    }
  }

  public getIsoleucineDri(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
    if (age <= 1) {
      return 43 * weight;
    } else if (age <= 14) {
      return 22 * weight;
    } else if (gender === 'male') {
      return 19 * weight;
    } else {
      return lactating ? 30 * weight : pregnant ? 25 * weight : 19 * weight;
    }
  }

  public getLADri(energyConsumption: number): number {
    return 0.09 * energyConsumption;
  }

  public getLeucineDri(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
    if (age <= 1) {
      return 93 * weight;
    } else if (age <= 14) {
      return 49 * weight;
    } else if (gender === 'male') {
      return 42 * weight;
    } else {
      return lactating ? 62 * weight : pregnant ? 56 * weight : 42 * weight;
    }
  }

  public getLysineDri(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
    if (age <= 1) {
      return 89 * weight;
    } else if (age <= 14) {
      return 46 * weight;
    } else if (gender === 'male') {
      return 38 * weight;
    } else {
      return lactating ? 52 * weight : pregnant ? 51 * weight : 38 * weight;
    }
  }

  public getMagnesiumDri(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (age <= 1) {
      return 75;
    } else if (age <= 14) {
      return 240;
    } else if (gender === 'male') {
      return 420;
    } else {
      return lactating ? 310 : pregnant ? 350 : 320;
    }
  }

  public getManganeseDri(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (age <= 1) {
      return 0.6;
    } else if (age <= 14) {
      return 1.5;
    } else if (gender === 'male') {
      return 2.3;
    } else {
      return lactating ? 2.6 : pregnant ? 2 : 1.8;
    }
  }

  public getMethionineDri(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
    if (age <= 1) {
      return 43 * weight;
    } else if (age <= 14) {
      return 22 * weight;
    } else if (gender === 'male') {
      return 19 * weight;
    } else {
      return lactating ? 26 * weight : pregnant ? 25 * weight : 19 * weight;
    }
  }

  public getMolybdenumDri(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (age <= 1) {
      return 0.02;
    } else if (age <= 14) {
      return 0.04;
    } else if (gender === 'male') {
      return 0.045;
    } else {
      return lactating ? 0.05 : pregnant ? 0.05 : 0.045;
    }
  }

  public getNiacinDri(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (age <= 1) {
      return 4;
    } else if (age <= 14) {
      return 12;
    } else if (gender === 'male') {
      return 16;
    } else {
      return lactating ? 17 : pregnant ? 18 : 14;
    }
  }

  public getPantothenicAcidDri(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (age <= 1) {
      return 1.8;
    } else if (age <= 14) {
      return 3;
    } else if (gender === 'male') {
      return 5;
    } else {
      return lactating ? 7 : pregnant ? 6 : 5;
    }
  }

  public getPhenylalanineDri(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
    if (age <= 1) {
      return 84 * weight;
    } else if (age <= 14) {
      return 41 * weight;
    } else if (gender === 'male') {
      return 33 * weight;
    } else {
      return lactating ? 51 * weight : pregnant ? 44 * weight : 33 * weight;
    }
  }

  public getPhosphorusDri(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (age <= 1) {
      return 275;
    } else if (age <= 14) {
      return 500;
    } else {
      return 700;
    }
  }

  public getPotassiumDri(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (age <= 1) {
      return 700;
    } else if (age <= 14) {
      return 3800;
    } else if (gender === 'male') {
      return 4700;
    } else {
      return lactating ? 5100 : pregnant ? 4700 : 4700;
    }
  }

  public getProteinDri(energyConsumption: number): number {
    return 0.2 * energyConsumption;
  }

  public getPyridoxineDri(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (age <= 1) {
      return 0.3;
    } else if (age <= 14) {
      return 1;
    } else if (gender === 'male') {
      return 1.7;
    } else {
      return lactating ? 2 : pregnant ? 1.9 : 1.5;
    }
  }

  public getRiboflavinDri(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (age <= 1) {
      return 0.4;
    } else if (age <= 14) {
      return 0.9;
    } else if (gender === 'male') {
      return 1.3;
    } else {
      return lactating ? 1.6 : pregnant ? 1.4 : 1.1;
    }
  }

  public getSeleniumDri(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (age <= 1) {
      return 0.02;
    } else if (age <= 14) {
      return 0.03;
    } else if (gender === 'male') {
      return 0.055;
    } else {
      return lactating ? 0.07 : pregnant ? 0.06 : 0.055;
    }
  }

  public getSodiumDri(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (age <= 1) {
      return 500;
    } else if (age <= 14) {
      return 1000;
    } else {
      return 1500;
    }
  }

  public getSugarsDri(energyConsumption: number): number {
    return 0.1 * energyConsumption;
  }

  public getThiamineDri(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (age <= 1) {
      return 0.3;
    } else if (age <= 14) {
      return 0.9;
    } else if (gender === 'male') {
      return 1.2;
    } else {
      return lactating ? 1.4 : pregnant ? 1.4 : 0.1;
    }
  }

  public getThreonineDri(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
    if (age <= 1) {
      return 49 * weight;
    } else if (age <= 14) {
      return 24 * weight;
    } else if (gender === 'male') {
      return 20 * weight;
    } else {
      return lactating ? 30 * weight : pregnant ? 26 * weight : 20 * weight;
    }
  }

  public getTransFatDri(): number {
    return 0;
  }

  public getTryptophanDri(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
    if (age <= 1) {
      return 13 * weight;
    } else if (age <= 14) {
      return 6 * weight;
    } else if (gender === 'male') {
      return 5 * weight;
    } else {
      return lactating ? 9 * weight : pregnant ? 7 * weight : 5 * weight;
    }
  }

  public getValineDri(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
    if (age <= 1) {
      return 56 * weight;
    } else if (age <= 14) {
      return 28 * weight;
    } else if (gender === 'male') {
      return 24 * weight;
    } else {
      return lactating ? 35 * weight : pregnant ? 31 * weight : 24 * weight;
    }
  }

  public getVitaminADri(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (age <= 1) {
      return 0.5;
    } else if (age <= 14) {
      return 0.6;
    } else if (gender === 'male') {
      return 0.9;
    } else {
      return lactating ? 1.3 : pregnant ? 0.77 : 0.7;
    }
  }

  public getVitaminCDri(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (age <= 1) {
      return 50;
    } else if (age <= 14) {
      return 50;
    } else if (gender === 'male') {
      return 90;
    } else {
      return lactating ? 120 : pregnant ? 85 : 75;
    }
  }

  public getVitaminDDri(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (age <= 1) {
      return 0.01;
    } else if (age <= 14) {
      return 0.015;
    } else {
      return 0.015;
    }
  }

  public getVitaminEDri(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (age <= 1) {
      return 5;
    } else if (age <= 14) {
      return 11;
    } else {
      return 15;
    }
  }

  public getVitaminKDri(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (age <= 1) {
      return 0.0025;
    } else if (age <= 14) {
      return 0.06;
    } else if (gender === 'male') {
      return 0.12;
    } else {
      return 0.09;
    }
  }

  public getWater(energyConsumption: number): number {
    return energyConsumption;
  }

  public getZincDri(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (age <= 1) {
      return 2;
    } else if (age <= 14) {
      return 5;
    } else if (gender === 'male') {
      return 11;
    } else {
      return lactating ? 12 : pregnant ? 11 : 8;
    }
  }

}
