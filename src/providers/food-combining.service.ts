import { Injectable } from '@angular/core';

// Models
import { MealFoodItem, MealWarning } from '../models';

/**
 * TODOs: There seem to be some exceptions in combining
 * Sour milk - Sweet fruits
 * Low-fat dairy - Acid/Sub-acid fruits
 * Nuts - Adcid/Sub-acid fruits
 * 
 * !!! THE USER NEEDS TO EXPERIMENT !!!
 */

@Injectable()
export class FoodCombiningService {

  constructor() { }

  /**
   * Verifies if the food items in a meal are well combined
   * 
   * @param {Array} foodItems The food items to check
   * @returns {Array} Returns a list of warnings if there are wrong combinations
   */
  public checkCombining(foodItems: Array<MealFoodItem>): Array<MealWarning> {
    let acidFruits: Array<MealFoodItem> = [],
      fats: Array<MealFoodItem> = [],
      hasAcids: boolean = false,
      hasFluids: boolean = false,
      hasMelon: boolean = false,
      hasMilk: boolean = false,
      hasSugars: boolean = false,
      proteins: Array<MealFoodItem> = [],
      starches: Array<MealFoodItem> = [],
      subAcidFruits: Array<MealFoodItem> = [],
      sweetFruits: Array<MealFoodItem> = [],
      veggies: Array<MealFoodItem> = [],
      warnings: Array<MealWarning> = [];

    foodItems.forEach((item: MealFoodItem) => {

      // Check the food type
      switch (item.type) {
        case 'Acid':
          hasAcids = true;
          break;

        case 'Acid fruit':
          acidFruits.push(item);
          hasAcids = true;
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

        case 'Starch':
          starches.push(item);
          break;

        case 'Sub-acid fruit':
          subAcidFruits.push(item);
          break;

        case 'Sugar':
          hasSugars = true;
          break;

        case 'Sweet fruit':
          sweetFruits.push(item);
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
        new MealWarning(
          'No starch and protein at the same meal!',
          'Starch digestion requires alkaline medium, whereas protein digestion require acid medium.'
        )
      );
    }

    /**
     * Rule #2
     * Not Starch-Acid
     */
    if (!!starches.length && hasAcids) {
      warnings.push(
        new MealWarning(
          'No starch and acid at the same meal!',
          'Starch digestion requires alkaline medium, whereas acid digestion require acid medium.'
        )
      );
    }

    /**
     * Rule #3
     * Not Protein-Protein of different families
     */
    if (proteins.length > 1 && proteins[0].group !== proteins[1].group) {
      warnings.push(
        new MealWarning(
          'No more than one type of protein at the same meal!',
          'Each kind of protein requires different digestive secretion timings and preparations'
        )
      );
    }

    /**
     * Rule #4
     * Not Acid-Protein
     */
    if (hasAcids && !!proteins.length) {
      warnings.push(
        new MealWarning(
          'No acid and protein at the same meal!',
          'Pepsin, the enzyme required for protein digestion, is inhibited or destroyed by excess stomach acidity'
        )
      );
    }

    /**
     * Rule #5
     * Not Fat-Protein
     */
    if (!!fats.length && !!proteins.length) {
      warnings.push(
        new MealWarning(
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
        new MealWarning(
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
        new MealWarning(
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
        new MealWarning(
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
        new MealWarning(
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
        new MealWarning(
          'No fluids after or during meals!',
          'Fluids dilute the gastric juices required for digestion.'
        )
      );
    }

    /**
     * Rule #10
     * Fruits alone
     */
    if ((!!acidFruits.length && acidFruits.length > foodItems.length) || (!!subAcidFruits.length && subAcidFruits.length > foodItems.length) || (!!sweetFruits.length && sweetFruits.length > foodItems.length)) {
      warnings.push(
        new MealWarning(
          'Fruits go alone or stay alone!',
          'Fruits undergo a brief digestion (30-60 minutes) in the small intestine. Any other food would hold fruit in the stomach and make them ferment.'
        )
      );
    }

    /**
     * Rule #11
     * Not Acid fruits - Sweet fruits
     */
    if (!!acidFruits.length && !!sweetFruits.length) {
      warnings.push(
        new MealWarning(
          'No acid fruit and sweet fruit at the same meal!',
          'Sweet fruit do not undergo any sort of digestion in the mouth or stomach, but only a brief digestion (30 minutes) in the small intestine. Acid fruit hold sweet fruit in the stomach and make them ferment. The sugar from sweet fruit also inhibit ptyalin secretion, the enzyme from saliva required for acid digestion.'
        )
      );
    }

    return warnings;
  }

}
