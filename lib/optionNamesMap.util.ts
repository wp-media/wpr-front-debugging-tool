import OptionsJSONText from './optionNamesMap.json?raw';
import OtherJSONText from './otherNamesMap.json?raw';

let tempObject = {};
try {
  tempObject = { ...JSON.parse(OptionsJSONText), ...JSON.parse(OtherJSONText) };
} catch (e) {
  tempObject = {};
}
export const OptionNames = tempObject;
export const OptionNamesMap = new Map<string, string>(Object.entries(OptionNames));

export function getRealOptionName(option: string): string {
  return OptionNamesMap.get(option) ?? option;
}
