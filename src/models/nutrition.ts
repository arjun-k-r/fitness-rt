import { INdbFood } from './food';

export class Nutrient {
    constructor(
        public id: number,
        public group: string,
        public name: string,
        public unit: string,
        public value: number = 0
    ) { }
}

export class Nutrition {
    constructor(
        public water: Nutrient = new Nutrient(255, 'Proximates', 'Water', 'g'),
        public energy: Nutrient = new Nutrient(208, 'Proximates', 'Energy', 'kcal'),
        public protein: Nutrient = new Nutrient(203, 'Proximates', 'Protein', 'g'),
        public fats: Nutrient = new Nutrient(204, 'Proximates', 'Fats', 'g'),
        public carbs: Nutrient = new Nutrient(205, 'Proximates', 'Carbohydrates', 'g'),
        public lactose: Nutrient = new Nutrient(213, 'Proximates', 'Lactose', 'g'),
        public fiber: Nutrient = new Nutrient(291, 'Proximates', 'Fiber', 'g'),
        public sugars: Nutrient = new Nutrient(269, 'Proximates', 'Sugars', 'g'),
        public calcium: Nutrient = new Nutrient(301, 'Minerals', 'Calcium', 'mg'),
        public iron: Nutrient = new Nutrient(303, 'Minerals', 'Iron', 'mg'),
        public magnesium: Nutrient = new Nutrient(304, 'Minerals', 'Magnesium', 'mg'),
        public phosphorus: Nutrient = new Nutrient(305, 'Minerals', 'Phosphorus', 'mg'),
        public potassium: Nutrient = new Nutrient(306, 'Minerals', 'Potassium', 'mg'),
        public sodium: Nutrient = new Nutrient(307, 'Minerals', 'Sodium', 'mg'),
        public zinc: Nutrient = new Nutrient(309, 'Minerals', 'Zinc', 'mg'),
        public copper: Nutrient = new Nutrient(312, 'Minerals', 'Copper', 'mg'),
        public manganese: Nutrient = new Nutrient(315, 'Minerals', 'Manganese', 'mg'),
        public selenium: Nutrient = new Nutrient(317, 'Minerals', 'Selenium', 'ug'),
        public vitaminC: Nutrient = new Nutrient(401, 'Vitamins', 'Vitamin C', 'mg'),
        public vitaminB1: Nutrient = new Nutrient(404, 'Vitamins', 'Vitamin B1', 'mg'),
        public vitaminB2: Nutrient = new Nutrient(405, 'Vitamins', 'Vitamin B2', 'mg'),
        public vitaminB3: Nutrient = new Nutrient(406, 'Vitamins', 'Vitamin B3', 'mg'),
        public vitaminB5: Nutrient = new Nutrient(410, 'Vitamins', 'Vitamin B5', 'mg'),
        public vitaminB6: Nutrient = new Nutrient(415, 'Vitamins', 'Vitamin B6', 'mg'),
        public vitaminB9: Nutrient = new Nutrient(431, 'Vitamins', 'Vitamin B9', 'ug'),
        public choline: Nutrient = new Nutrient(421, 'Vitamins', 'Choline', 'mg'),
        public vitaminB12: Nutrient = new Nutrient(418, 'Vitamins', 'Vitamin B12', 'ug'),
        public vitaminA: Nutrient = new Nutrient(320, 'Vitamins', 'Vitamin A', 'ug'),
        public vitaminE: Nutrient = new Nutrient(323, 'Vitamins', 'Vitamin E', 'mg'),
        public vitaminD: Nutrient = new Nutrient(328, 'Vitamins', 'Vitamin D', 'ug'),
        public vitaminK: Nutrient = new Nutrient(329, 'Vitamins', 'Vitamin K', 'ug'),
        public satFat: Nutrient = new Nutrient(606, 'Lipids', 'Saturated fat', 'g'),
        public omega6: Nutrient = new Nutrient(618, 'Lipids', 'Omega-6', 'g'),
        public omega3: Nutrient = new Nutrient(619, 'Lipids', 'Omega-3', 'g'),
        public transFat: Nutrient = new Nutrient(605, 'Lipids', 'Trans fat', 'g'),
        public cholesterol: Nutrient = new Nutrient(601, 'Lipids', 'Cholesterol', 'mg'),
        public tryptophan: Nutrient = new Nutrient(501, 'Amino Acids', 'Tryptophan', 'g'),
        public threonine: Nutrient = new Nutrient(502, 'Amino Acids', 'Threonine', 'g'),
        public isoleucine: Nutrient = new Nutrient(503, 'Amino Acids', 'Isoleucine', 'g'),
        public leucine: Nutrient = new Nutrient(504, 'Amino Acids', 'Leucine', 'g'),
        public lysine: Nutrient = new Nutrient(505, 'Amino Acids', 'Lysine', 'g'),
        public methionine: Nutrient = new Nutrient(506, 'Amino Acids', 'Methionine', 'g'),
        public phenylalanine: Nutrient = new Nutrient(508, 'Amino Acids', 'Phenylalanine', 'g'),
        public valine: Nutrient = new Nutrient(510, 'Amino Acids', 'Valine', 'g'),
		public arginine: Nutrient = new Nutrient(511, 'Amino Acids', 'Arginine', 'g'),
        public histidine: Nutrient = new Nutrient(512, 'Amino Acids', 'Histidine', 'g'),
        public alcohol: Nutrient = new Nutrient(221, 'Other', 'Alcohol', 'g'),
        public caffeine: Nutrient = new Nutrient(262, 'Other', 'Caffeine', 'mg'),
    ) {  }

    public setNutrientValue(nutrients: Array<INdbFood>): void {
        nutrients.forEach((item: INdbFood) => {
            switch (item.nutrient_id.toString()) {
                case '255':
                    this.water.value = +item.value;
                    break;

                case '208':
                    this.energy.value = +item.value;
                    break;

                case '203':
                    this.protein.value = +item.value;
                    break;

                case '204':
                    this.fats.value = +item.value;
                    break;

                case '205':
                    this.carbs.value = +item.value;
                    break;

                case '213':
                    this.lactose.value = +item.value;
                    break;

                case '291':
                    this.fiber.value = +item.value;
                    break;

                case '269':
                    this.sugars.value = +item.value;
                    break;

                case '301':
                    this.calcium.value = +item.value;
                    break;

                case '303':
                    this.iron.value = +item.value;
                    break;

                case '304':
                    this.magnesium.value = +item.value;
                    break;

                case '305':
                    this.phosphorus.value = +item.value;
                    break;

                case '306':
                    this.potassium.value = +item.value;
                    break;

                case '307':
                    this.sodium.value = +item.value;
                    break;

                case '309':
                    this.zinc.value = +item.value;
                    break;

                case '312':
                    this.copper.value = +item.value;
                    break;

                case '315':
                    this.manganese.value = +item.value;
                    break;

                case '317':
                    this.selenium.value = +item.value;
                    break;

                case '401':
                    this.vitaminC.value = +item.value;
                    break;

                case '404':
                    this.vitaminB1.value = +item.value;
                    break;

                case '405':
                    this.vitaminB2.value = +item.value;
                    break;

                case '406':
                    this.vitaminB3.value = +item.value;
                    break;

                case '410':
                    this.vitaminB5.value = +item.value;
                    break;

                case '415':
                    this.vitaminB5.value = +item.value;
                    break;

                case '417':
                    this.vitaminB9.value = +item.value;
                    break;

                case '421':
                    this.choline.value = +item.value;
                    break;
                
                case '418':
                    this.vitaminB12.value = +item.value;
                    break;

                case '320':
                    this.vitaminA.value = +item.value;
                    break;

                case '323':
                    this.vitaminE.value = +item.value;
                    break;

                case '328':
                    this.vitaminD.value = +item.value;
                    break;
            
                case '430':
                    this.vitaminK.value = +item.value;
                    break;

                case '606':
                    this.satFat.value = +item.value;
                    break;

                case '618':
                    this.omega3.value = +item.value;
                    break;

                case '619':
                    this.omega6.value = +item.value;
                    break;

                case '605':
                    this.transFat.value = +item.value;
                    break;

                case '601':
                    this.cholesterol.value = +item.value;
                    break;

                case '501':
                    this.tryptophan.value = +item.value;
                    break;

                case '502':
                    this.threonine.value = +item.value;
                    break;

                case '503':
                    this.isoleucine.value = +item.value;
                    break;

                case '504':
                    this.leucine.value = +item.value;
                    break;

                case '505':
                    this.lysine.value = +item.value;
                    break;

                case '506':
                    this.methionine.value = +item.value;
                    break;

                case '508':
                    this.phenylalanine.value = +item.value;
                    break;

                case '510':
                    this.valine.value = +item.value;
                    break;
					
				case '511':
                    this.arginine.value = +item.value;
                    break;

                case '512':
                    this.histidine.value = +item.value;
                    break;

                default:
                    break;
            }
        });
    }
}
