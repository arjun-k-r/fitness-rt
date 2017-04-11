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
        public caffeine: Nutrient = new Nutrient(262, 'Other', 'Caffeine', 'mg')
    ) {  }
}
