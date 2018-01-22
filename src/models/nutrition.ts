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
  constructor(
    private energyValue: number = 0,
    private waterValue: number = 0,
    private proteinValue: number = 0,
    private carbsValue: number = 0,
    private fiberValue: number = 0,
    private sugarsValue: number = 0,
    private fatsValue: number = 0,
    private transFatValue: number = 0,
    private alaValue: number = 0,
    private laValue: number = 0,
    private histidineValue: number = 0,
    private isoleucineValue: number = 0,
    private leucineValue: number = 0,
    private lysineValue: number = 0,
    private methionineValue: number = 0,
    private phenylalanineValue: number = 0,
    private tryptophanValue: number = 0,
    private threonineValue: number = 0,
    private valineValue: number = 0,
    private calciumValue: number = 0,
    private copperValue: number = 0,
    private ironValue: number = 0,
    private magnesiumValue: number = 0,
    private manganeseValue: number = 0,
    private phosphorusValue: number = 0,
    private potassiumValue: number = 0,
    private seleniumValue: number = 0,
    private sodiumValue: number = 0,
    private zincValue: number = 0,
    private vitaminAValue: number = 0,
    private vitaminB1Value: number = 0,
    private vitaminB2Value: number = 0,
    private vitaminB3Value: number = 0,
    private vitaminB5Value: number = 0,
    private vitaminB6Value: number = 0,
    private vitaminB9Value: number = 0,
    private vitaminB12Value: number = 0,
    private cholineValue: number = 0,
    private vitaminCValue: number = 0,
    private vitaminDValue: number = 0,
    private vitaminEValue: number = 0,
    private vitaminKValue: number = 0
  ) {
    this.energy = new Nutrient(208, 'Proximates', 'Energy', 'kcal', this.energyValue),
    this.water = new Nutrient(255, 'Proximates', 'Water', 'g', this.waterValue),
    this.protein = new Nutrient(203, 'Proximates', 'Protein', 'g', this.proteinValue),
    this.carbs = new Nutrient(205, 'Proximates', 'Carbohydrates', 'g', this.carbsValue),
    this.fiber = new Nutrient(291, 'Proximates', 'Fiber', 'g', this.fiberValue),
    this.sugars = new Nutrient(269, 'Proximates', 'Sugars', 'g', this.sugarsValue),
    this.fats = new Nutrient(204, 'Proximates', 'Fats', 'g', this.fatsValue),
    this.transFat = new Nutrient(605, 'Lipids', 'Trans fat', 'g', this.transFatValue),
    this.ala = new Nutrient(619, 'Lipids', 'Omega-3 (ALA)', 'g', this.alaValue),
    this.la = new Nutrient(618, 'Lipids', 'Omega-6 (LA)', 'g', this.laValue),
    this.histidine = new Nutrient(512, 'Amino Acids', 'Histidine', 'g', this.histidineValue),
    this.isoleucine = new Nutrient(503, 'Amino Acids', 'Isoleucine', 'g', this.isoleucineValue),
    this.leucine = new Nutrient(504, 'Amino Acids', 'Leucine', 'g', this.leucineValue),
    this.lysine = new Nutrient(505, 'Amino Acids', 'Lysine', 'g', this.lysineValue),
    this.methionine = new Nutrient(506, 'Amino Acids', 'Methionine', 'g', this.methionineValue),
    this.phenylalanine = new Nutrient(508, 'Amino Acids', 'Phenylalanine', 'g', this.phenylalanineValue),
    this.tryptophan = new Nutrient(501, 'Amino Acids', 'Tryptophan', 'g', this.tryptophanValue),
    this.threonine = new Nutrient(502, 'Amino Acids', 'Threonine', 'g', this.threonineValue),
    this.valine = new Nutrient(510, 'Amino Acids', 'Valine', 'g', this.valineValue),
    this.calcium = new Nutrient(301, 'Minerals', 'Calcium', 'mg', this.calciumValue),
    this.copper = new Nutrient(312, 'Minerals', 'Copper', 'mg', this.copperValue),
    this.iron = new Nutrient(303, 'Minerals', 'Iron', 'mg', this.ironValue),
    this.magnesium = new Nutrient(304, 'Minerals', 'Magnesium', 'mg', this.magnesiumValue),
    this.manganese = new Nutrient(315, 'Minerals', 'Manganese', 'mg', this.manganeseValue),
    this.phosphorus = new Nutrient(305, 'Minerals', 'Phosphorus', 'mg', this.phosphorusValue),
    this.potassium = new Nutrient(306, 'Minerals', 'Potassium', 'mg', this.potassiumValue),
    this.selenium = new Nutrient(317, 'Minerals', 'Selenium', 'ug', this.seleniumValue),
    this.sodium = new Nutrient(307, 'Minerals', 'Sodium', 'mg', this.sodiumValue),
    this.zinc = new Nutrient(309, 'Minerals', 'Zinc', 'mg', this.zincValue),
    this.vitaminA = new Nutrient(320, 'Vitamins', 'Vitamin A', 'ug', this.vitaminAValue),
    this.vitaminB1 = new Nutrient(404, 'Vitamins', 'Vitamin B1', 'mg', this.vitaminB1Value),
    this.vitaminB2 = new Nutrient(405, 'Vitamins', 'Vitamin B2', 'mg', this.vitaminB2Value),
    this.vitaminB3 = new Nutrient(406, 'Vitamins', 'Vitamin B3', 'mg', this.vitaminB3Value),
    this.vitaminB5 = new Nutrient(410, 'Vitamins', 'Vitamin B5', 'mg', this.vitaminB5Value),
    this.vitaminB6 = new Nutrient(415, 'Vitamins', 'Vitamin B6', 'mg', this.vitaminB6Value),
    this.vitaminB9 = new Nutrient(431, 'Vitamins', 'Vitamin B9', 'ug', this.vitaminB9Value),
    this.vitaminB12 = new Nutrient(418, 'Vitamins', 'Vitamin B12', 'ug', this.vitaminB12Value),
    this.choline = new Nutrient(421, 'Vitamins', 'Choline', 'mg', this.cholineValue),
    this.vitaminC = new Nutrient(401, 'Vitamins', 'Vitamin C', 'mg', this.vitaminCValue),
    this.vitaminD = new Nutrient(328, 'Vitamins', 'Vitamin D', 'ug', this.vitaminDValue),
    this.vitaminE = new Nutrient(323, 'Vitamins', 'Vitamin E', 'mg', this.vitaminAValue),
    this.vitaminK = new Nutrient(329, 'Vitamins', 'Vitamin K', 'ug', this.vitaminKValue)

    delete this.energyValue;
    delete this.waterValue;
    delete this.proteinValue;
    delete this.carbsValue;
    delete this.fiberValue;
    delete this.sugarsValue;
    delete this.fatsValue;
    delete this.transFatValue;
    delete this.alaValue;
    delete this.laValue;
    delete this.histidineValue;
    delete this.isoleucineValue;
    delete this.leucineValue;
    delete this.lysineValue;
    delete this.methionineValue;
    delete this.phenylalanineValue;
    delete this.tryptophanValue;
    delete this.threonineValue;
    delete this.valineValue;
    delete this.calciumValue;
    delete this.copperValue;
    delete this.ironValue;
    delete this.magnesiumValue;
    delete this.manganeseValue;
    delete this.phosphorusValue;
    delete this.potassiumValue;
    delete this.seleniumValue;
    delete this.sodiumValue;
    delete this.zincValue;
    delete this.vitaminAValue;
    delete this.vitaminB1Value;
    delete this.vitaminB2Value;
    delete this.vitaminB3Value;
    delete this.vitaminB5Value;
    delete this.vitaminB6Value;
    delete this.vitaminB9Value;
    delete this.vitaminB12Value;
    delete this.cholineValue;
    delete this.vitaminCValue;
    delete this.vitaminDValue;
    delete this.vitaminEValue;
    delete this.vitaminKValue;
  }
}
