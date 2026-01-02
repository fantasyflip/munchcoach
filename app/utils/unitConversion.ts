// Unit conversion utilities for comparing quantities across different units

// Unit groups and their base conversion factors
// All conversions are relative to a base unit within each group

type UnitGroup = "mass" | "volume" | "count" | "spoon";

interface UnitDefinition {
  group: UnitGroup;
  toBase: number; // Multiply by this to convert to base unit
}

// Base units: g (mass), ml (volume), pcs (count), tsp (spoon)
const unitDefinitions: Record<string, UnitDefinition> = {
  // Mass units - base: g
  g: { group: "mass", toBase: 1 },
  kg: { group: "mass", toBase: 1000 },

  // Volume units - base: ml
  ml: { group: "volume", toBase: 1 },
  l: { group: "volume", toBase: 1000 },

  // Count units - base: pcs
  pcs: { group: "count", toBase: 1 },

  // Spoon units - base: tsp (1 tbsp = 3 tsp)
  tsp: { group: "spoon", toBase: 1 },
  tbsp: { group: "spoon", toBase: 3 },
};

/**
 * Check if two units are in the same group and can be compared
 */
export function areUnitsComparable(
  unit1: string | null | undefined,
  unit2: string | null | undefined,
): boolean {
  if (!unit1 || !unit2) return false;

  const def1 = unitDefinitions[unit1.toLowerCase()];
  const def2 = unitDefinitions[unit2.toLowerCase()];

  if (!def1 || !def2) return false;

  return def1.group === def2.group;
}

/**
 * Convert a quantity from one unit to another within the same group
 * Returns null if conversion is not possible
 */
export function convertUnit(
  quantity: number,
  fromUnit: string,
  toUnit: string,
): number | null {
  const fromDef = unitDefinitions[fromUnit.toLowerCase()];
  const toDef = unitDefinitions[toUnit.toLowerCase()];

  if (!fromDef || !toDef) return null;
  if (fromDef.group !== toDef.group) return null;

  // Convert to base unit, then to target unit
  const baseValue = quantity * fromDef.toBase;
  return baseValue / toDef.toBase;
}

/**
 * Convert a quantity to the base unit of its group
 */
export function toBaseUnit(
  quantity: number,
  unit: string,
): { value: number; baseUnit: string } | null {
  const def = unitDefinitions[unit.toLowerCase()];
  if (!def) return null;

  const baseUnits: Record<UnitGroup, string> = {
    mass: "g",
    volume: "ml",
    count: "pcs",
    spoon: "tsp",
  };

  return {
    value: quantity * def.toBase,
    baseUnit: baseUnits[def.group],
  };
}

/**
 * Compare two quantities with potentially different but compatible units
 * Returns the difference in the target unit (positive = have more than need)
 */
export function compareQuantities(
  haveQuantity: number | null | undefined,
  haveUnit: string | null | undefined,
  needQuantity: number | null | undefined,
  needUnit: string | null | undefined,
): {
  sufficient: boolean;
  missingQuantity: number | null;
  missingUnit: string | null;
  convertedHaveQuantity: number | null;
} {
  // If no quantities, assume sufficient (we can't compare)
  if (!needQuantity) {
    return {
      sufficient: true,
      missingQuantity: null,
      missingUnit: null,
      convertedHaveQuantity: haveQuantity ?? null,
    };
  }

  // If we have nothing, we're missing everything
  if (!haveQuantity) {
    return {
      sufficient: false,
      missingQuantity: needQuantity,
      missingUnit: needUnit ?? null,
      convertedHaveQuantity: 0,
    };
  }

  // If units are the same, simple comparison
  if (haveUnit === needUnit || (!haveUnit && !needUnit)) {
    const missing = needQuantity - haveQuantity;
    return {
      sufficient: missing <= 0,
      missingQuantity: missing > 0 ? missing : null,
      missingUnit: needUnit ?? null,
      convertedHaveQuantity: haveQuantity,
    };
  }

  // Try to convert units
  if (haveUnit && needUnit && areUnitsComparable(haveUnit, needUnit)) {
    const convertedHave = convertUnit(haveQuantity, haveUnit, needUnit);
    if (convertedHave !== null) {
      const missing = needQuantity - convertedHave;
      return {
        sufficient: missing <= 0,
        missingQuantity: missing > 0 ? Math.round(missing * 100) / 100 : null,
        missingUnit: needUnit,
        convertedHaveQuantity: Math.round(convertedHave * 100) / 100,
      };
    }
  }

  // Units are not comparable - assume insufficient to be safe
  return {
    sufficient: false,
    missingQuantity: needQuantity,
    missingUnit: needUnit ?? null,
    convertedHaveQuantity: null,
  };
}

/**
 * Format a quantity with its unit, using a more readable unit if possible
 * e.g., 1500g -> 1.5kg
 * Always rounds to 2 decimal places for display
 */
export function formatSmartQuantity(
  quantity: number | null | undefined,
  unit: string | null | undefined,
): string {
  if (quantity === null || quantity === undefined) return "";

  // Round to 2 decimal places for display
  const rounded = roundQuantity(quantity);

  if (!unit) return String(rounded);

  const lowerUnit = unit.toLowerCase();

  // Convert to larger units if appropriate
  if (lowerUnit === "g" && rounded >= 1000) {
    return `${roundQuantity(rounded / 1000)}kg`;
  }
  if (lowerUnit === "ml" && rounded >= 1000) {
    return `${roundQuantity(rounded / 1000)}l`;
  }

  return `${rounded}${unit}`;
}

/**
 * Round a quantity to 2 decimal places, removing trailing zeros
 */
export function roundQuantity(quantity: number): number {
  const rounded = Math.round(quantity * 100) / 100;
  return rounded;
}

/**
 * Format a rounded quantity as string, removing unnecessary decimals
 */
export function formatRoundedQuantity(
  quantity: number | null | undefined,
): string {
  if (quantity === null || quantity === undefined) return "";
  const rounded = roundQuantity(quantity);
  // Remove trailing zeros after decimal
  return rounded.toString();
}
