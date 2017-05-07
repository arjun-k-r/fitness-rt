import { Injectable } from '@angular/core';

// Models
import { Food, WarningMessage } from '../models';

@Injectable()
export class FoodCombiningService {

  constructor() { }

  /**
   * Verifies if the foods in a meal are well combined
   * 
   * @param {Array} foodItems The foods to check
   * @returns {Array} Returns a list of warnings if there are wrong combinations
   */
  public checkCombining(foodItems: Array<Food>): Array<WarningMessage> {
    let acidFruits: Array<Food> = [],
      acids: Array<Food> = [],
      fats: Array<Food> = [],
      hasFluids: boolean = false,
      hasFruits: boolean = false,
      hasMelon: boolean = false,
      hasMilk: boolean = false,
      hasSugars: boolean = false,
      proteinFats: Array<Food> = [],
      proteins: Array<Food> = [],
      starches: Array<Food> = [],
      subAcidFruits: Array<Food> = [],
      sweetFruits: Array<Food> = [],
      veggies: Array<Food> = [],
      warnings: Array<WarningMessage> = [];

    foodItems.forEach((item: Food) => {

      // Check the food type
      switch (item.type) {
        case 'Acid':
          acids.push(item);
          break;

        case 'Acid fruit':
          acidFruits.push(item);
          acids.push(item);
          hasFruits = true;
          break;

        case 'Fat':
          fats.push(item);
          break;

        case 'Fluid':
          hasFluids = true;
          break;

        case 'Melon':
          hasMelon = true;
          break;

        case 'Milk':
          hasMilk = true;
          break;

        case 'Protein':
          proteins.push(item);
          break;

        case 'Protein-Fat':
          proteins.push(item);
          proteinFats.push(item);
          fats.push(item);
          break;

        case 'Starch':
          starches.push(item);
          break;

        case 'Sub-acid fruit':
          subAcidFruits.push(item);
          hasFruits = true;
          break;

        case 'Sugar':
          hasSugars = true;
          break;

        case 'Sweet fruit':
          sweetFruits.push(item);
          hasFruits = true;
          break;

        case 'Veggie':
          veggies.push(item);
          break;

        default:
          break;
      }
    });

    /**
     * Rule #1
     * Not Starch-Protein
     */
    if (!!starches.length && !!proteins.length) {
      warnings.push(
        new WarningMessage(
          'No starch and protein at the same meal!',
          'Starch digestion requires alkaline medium, whereas protein digestion require acid medium.'
        )
      );
    }

    /**
     * Rule #2
     * Not Starch-Acid
     */
    if (!!starches.length && !!acids.length) {
      warnings.push(
        new WarningMessage(
          'No starch and acid at the same meal!',
          'Starch digestion requires alkaline medium, whereas acid digestion require acid medium.'
        )
      );
    }

    /**
     * Rule #3
     * Not Protein-Protein of different families
     */
    if (proteins.length > 1 && (proteins[0].group !== proteins[1].group)) {
      warnings.push(
        new WarningMessage(
          'No more than one type of protein at the same meal!',
          'Each kind of protein requires different digestive secretion timings and preparations'
        )
      );
    }

    /**
     * Rule #4
     * Not Acid-Protein
     * EXCEPTION: Acid with protein-fats
     */
    if (!!acids.length && !!proteins.length && proteins.length !== proteinFats.length) {
      warnings.push(
        new WarningMessage(
          'No acid and protein at the same meal!',
          'Pepsin, the enzyme required for protein digestion, is inhibited or destroyed by excess stomach acidity. The only exceptions is acids with protein fats, like nuts and seeds'
        )
      );
    }

    /**
     * Rule #5
     * Not Fat-Protein
     * 
     * !Watch out for protein fats: they are classified both as protein and fats
     */
    if (!!fats.length && !!proteins.length && fats.length !== proteinFats.length && proteins.length !== proteinFats.length) {
      warnings.push(
        new WarningMessage(
          'No fat and protein at the same meal!',
          'Fat inhibits gastric juice secretion and slow down digestion. Hence, fats also inhibit pepsin secretion, the enzyme required for protein digestion'
        )
      );
    }

    /**
     * Rule #6
     * Not Sugar-Protein
     */
    if ((hasSugars || !!sweetFruits.length) && !!proteins.length) {
      warnings.push(
        new WarningMessage(
          'No sweets and protein at the same meal!',
          'Sugars do not undergo any sort of digestion in the mout or stomach, but only a brief digestion (30 minutes) in the small intestine. Protein holds sugars in the stomach (4 hours) and makes them ferment. Sugars also inhibit gastric juice secretion.'
        )
      );
    }

    /**
     * Rule #6
     * Not Sugar-Starch
     */
    if ((hasSugars || !!sweetFruits.length) && !!starches.length) {
      warnings.push(
        new WarningMessage(
          'No sweets and starch at the same meal!',
          'Sugars do not undergo any sort of digestion in the mouth or stomach, but only a brief digestion (30 minutes) in the small intestine. Starch holds sugars in the stomach (2 hours) and makes them ferment. Sugars also inhibit ptyalin secretion, the enzyme from saliva required for starch digestion.'
        )
      );
    }

    /**
     * Rule #7
     * Melon alone
     */
    if (hasMelon && foodItems.length > 1) {
      warnings.push(
        new WarningMessage(
          'Melons go alone or stay alone',
          'Melons do not undergo any sort of digestion in the mouth or stomach, but only a brief digestion (10 minutes) in the small intestine. Any other food would hold melons in the stomach and make them ferment.'
        )
      );
    }

    /**
     * Rule #8
     * Milk alone
     */
    if (hasMilk && foodItems.length > 1) {
      warnings.push(
        new WarningMessage(
          'Milk goes alone or stays alone!',
          "Humans are the only species that drink another species' milk, even after infancy. Milk forms curds in the stomach which further suround particles of food, inhibiting the action of gastric juices upon them and preventing, thus, their digestion."
        )
      );
    }

    /**
     * Rule #9
     * Fluids alone
     */
    if (hasFluids && foodItems.length > 1) {
      warnings.push(
        new WarningMessage(
          'No fluids after or during meals!',
          'Fluids dilute the gastric juices required for digestion.'
        )
      );
    }

    /**
     * Rule #10
     * Fruits alone
     * EXCEPTION: Fruits with protein-fats
     */
    if (hasFruits && foodItems.length > 1 && (foodItems.length !== (acids.length + subAcidFruits.length + sweetFruits.length + proteinFats.length))) {
      warnings.push(
        new WarningMessage(
          'Fruits go alone or stay alone!',
          'Fruits undergo a brief digestion (30-60 minutes) in the small intestine. Any other food would hold fruit in the stomach and make them ferment. The only exception is fruits with low fat, low sugar dairy or protein fats, like nuts and seeds.'
        )
      );
    }

    /**
     * Rule #11
     * Not Acid fruits - Sweet fruits
     */
    if (!!acidFruits.length && !!sweetFruits.length) {
      warnings.push(
        new WarningMessage(
          'No acid fruit and sweet fruit at the same meal!',
          'Sweet fruit do not undergo any sort of digestion in the mouth or stomach, but only a brief digestion (30 minutes) in the small intestine. Acid fruit hold sweet fruit in the stomach and make them ferment. The sugar from sweet fruit also inhibit ptyalin secretion, the enzyme from saliva required for acid digestion.'
        )
      );
    }

    return warnings;
  }

}
