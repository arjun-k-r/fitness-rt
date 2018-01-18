export interface INutrientDetails {
  deficiency: Array<string>;
  functions: Array<string>;
  id: string;
  name: string;
  rdi: Array<string>;
  references: Array<{ credit: string, url: string }>;
  sources: Array<string>;
  type: string;
}

export class Nutrient {
  constructor(
    public id: number,
    public group: string,
    public name: string,
    public unit: string,
    public value: number
  ) { }
}

export class NutritionalValues {
  // Proximates
  public energy: Nutrient;
  public water: Nutrient;
  public protein: Nutrient;
  public carbs: Nutrient;
  public fiber: Nutrient;
  public sugars: Nutrient;
  public fats: Nutrient;
  public transFat: Nutrient;
  // Esential fatty acids
  public ala: Nutrient;
  public la: Nutrient;
  // Essential amino acids
  public histidine: Nutrient;
  public isoleucine: Nutrient;
  public leucine: Nutrient;
  public lysine: Nutrient;
  public methionine: Nutrient;
  public phenylalanine: Nutrient;
  public tryptophan: Nutrient;
  public threonine: Nutrient;
  public valine: Nutrient;
  // Minerals
  public calcium: Nutrient;
  public copper: Nutrient;
  public iron: Nutrient;
  public magnesium: Nutrient;
  public manganese: Nutrient;
  public phosphorus: Nutrient;
  public potassium: Nutrient;
  public selenium: Nutrient;
  public sodium: Nutrient;
  public zinc: Nutrient;
  // Vitamins
  public vitaminA: Nutrient;
  public vitaminB1: Nutrient;
  public vitaminB2: Nutrient;
  public vitaminB3: Nutrient;
  public vitaminB5: Nutrient;
  public vitaminB6: Nutrient;
  public vitaminB9: Nutrient;
  public vitaminB12: Nutrient;
  public choline: Nutrient;
  public vitaminC: Nutrient;
  public vitaminD: Nutrient;
  public vitaminE: Nutrient;
  public vitaminK: Nutrient;
  public alcohol: Nutrient;
  public caffeine: Nutrient;
  constructor(
    public energyValue: number,
    public waterValue: number,
    public proteinValue: number,
    public carbsValue: number,
    public fiberValue: number,
    public sugarsValue: number,
    public fatsValue: number,
    public transFatValue: number,
    public alaValue: number,
    public laValue: number,
    public histidineValue: number,
    public isoleucineValue: number,
    public leucineValue: number,
    public lysineValue: number,
    public methionineValue: number,
    public phenylalanineValue: number,
    public tryptophanValue: number,
    public threonineValue: number,
    public valineValue: number,
    public calciumValue: number,
    public copperValue: number,
    public ironValue: number,
    public magnesiumValue: number,
    public manganeseValue: number,
    public phosphorusValue: number,
    public potassiumValue: number,
    public seleniumValue: number,
    public sodiumValue: number,
    public zincValue: number,
    public vitaminAValue: number,
    public vitaminB1Value: number,
    public vitaminB2Value: number,
    public vitaminB3Value: number,
    public vitaminB5Value: number,
    public vitaminB6Value: number,
    public vitaminB9Value: number,
    public vitaminB12Value: number,
    public cholineValue: number,
    public vitaminCValue: number,
    public vitaminDValue: number,
    public vitaminEValue: number,
    public vitaminKValue: number,
    public alcoholValue: number,
    public caffeineValue: number
  ) {
    this.energy = new Nutrient(208, 'Proximates', 'Energy', 'kcal', energyValue),
    this.water = new Nutrient(255, 'Proximates', 'Water', 'g', waterValue),
    this.protein = new Nutrient(203, 'Proximates', 'Protein', 'g', proteinValue),
    this.carbs = new Nutrient(205, 'Proximates', 'Carbohydrates', 'g', carbsValue),
    this.fiber = new Nutrient(291, 'Proximates', 'Fiber', 'g', fiberValue),
    this.sugars = new Nutrient(269, 'Proximates', 'Sugars', 'g', sugarsValue),
    this.fats = new Nutrient(204, 'Proximates', 'Fats', 'g', fatsValue),
    this.transFat = new Nutrient(605, 'Lipids', 'Trans fat', 'g', transFatValue),
    this.ala = new Nutrient(619, 'Lipids', 'Omega-3 (ALA)', 'g', alaValue),
    this.la = new Nutrient(618, 'Lipids', 'Omega-6 (LA)', 'g', laValue),
    this.histidine = new Nutrient(512, 'Amino Acids', 'Histidine', 'g', histidineValue),
    this.isoleucine = new Nutrient(503, 'Amino Acids', 'Isoleucine', 'g', isoleucineValue),
    this.leucine = new Nutrient(504, 'Amino Acids', 'Leucine', 'g', leucineValue),
    this.lysine = new Nutrient(505, 'Amino Acids', 'Lysine', 'g', lysineValue),
    this.methionine = new Nutrient(506, 'Amino Acids', 'Methionine', 'g', methionineValue),
    this.phenylalanine = new Nutrient(508, 'Amino Acids', 'Phenylalanine', 'g', phenylalanineValue),
    this.tryptophan = new Nutrient(501, 'Amino Acids', 'Tryptophan', 'g', tryptophanValue),
    this.threonine = new Nutrient(502, 'Amino Acids', 'Threonine', 'g', threonineValue),
    this.valine = new Nutrient(510, 'Amino Acids', 'Valine', 'g', valineValue),
    this.calcium = new Nutrient(301, 'Minerals', 'Calcium', 'mg', calciumValue),
    this.copper = new Nutrient(312, 'Minerals', 'Copper', 'mg', copperValue),
    this.iron = new Nutrient(303, 'Minerals', 'Iron', 'mg', ironValue),
    this.magnesium = new Nutrient(304, 'Minerals', 'Magnesium', 'mg', magnesiumValue),
    this.manganese = new Nutrient(315, 'Minerals', 'Manganese', 'mg', manganeseValue),
    this.phosphorus = new Nutrient(305, 'Minerals', 'Phosphorus', 'mg', phosphorusValue),
    this.potassium = new Nutrient(306, 'Minerals', 'Potassium', 'mg', potassiumValue),
    this.selenium = new Nutrient(317, 'Minerals', 'Selenium', 'ug', seleniumValue),
    this.sodium = new Nutrient(307, 'Minerals', 'Sodium', 'mg', sodiumValue),
    this.zinc = new Nutrient(309, 'Minerals', 'Zinc', 'mg', zincValue),
    this.vitaminA = new Nutrient(320, 'Vitamins', 'Vitamin A', 'ug', vitaminAValue),
    this.vitaminB1 = new Nutrient(404, 'Vitamins', 'Vitamin B1', 'mg', vitaminB1Value),
    this.vitaminB2 = new Nutrient(405, 'Vitamins', 'Vitamin B2', 'mg', vitaminB2Value),
    this.vitaminB3 = new Nutrient(406, 'Vitamins', 'Vitamin B3', 'mg', vitaminB3Value),
    this.vitaminB5 = new Nutrient(410, 'Vitamins', 'Vitamin B5', 'mg', vitaminB5Value),
    this.vitaminB6 = new Nutrient(415, 'Vitamins', 'Vitamin B6', 'mg', vitaminB6Value),
    this.vitaminB9 = new Nutrient(431, 'Vitamins', 'Vitamin B9', 'ug', vitaminB9Value),
    this.vitaminB12 = new Nutrient(418, 'Vitamins', 'Vitamin B12', 'ug', vitaminB12Value),
    this.choline = new Nutrient(421, 'Vitamins', 'Choline', 'mg', cholineValue),
    this.vitaminC = new Nutrient(401, 'Vitamins', 'Vitamin C', 'mg', vitaminCValue),
    this.vitaminD = new Nutrient(328, 'Vitamins', 'Vitamin D', 'ug', vitaminDValue),
    this.vitaminE = new Nutrient(323, 'Vitamins', 'Vitamin E', 'mg', vitaminAValue),
    this.vitaminK = new Nutrient(329, 'Vitamins', 'Vitamin K', 'ug', vitaminKValue),
    this.alcohol = new Nutrient(221, 'Other', 'Alcohol', 'g', alcoholValue),
    this.caffeine = new Nutrient(262, 'Other', 'Caffeine', 'mg', caffeineValue)
  }
}
