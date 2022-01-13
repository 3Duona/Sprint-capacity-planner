import { ChangeEvent } from 'react';

const _checkLength = (inputText: string, maxLength: number | undefined) => {
  return maxLength !== undefined ? inputText.length <= maxLength : true;
};

const _checkRegex = (inputText: string, regexString: string | undefined, regexRuleReverse: boolean) => {
  if (regexString === undefined) {
    return true;
  }
  const regexValid = new RegExp(regexString).test(inputText);
  return regexRuleReverse ? !regexValid : regexValid;
};

// This function is used to validate rules, and if needed apply strict rules (e.g. don't allow input after max length)
const _validateInput = (
  e: ChangeEvent<HTMLInputElement>,
  check: Function,
  checkParams: any,
  strict: boolean,
  oldValue: string
) => {
  // If input is valid return that input is valid
  if (check(e.target.value, ...checkParams)) {
    return true;
  }
  // If input is not valid, and strict validation is on, set input to previous valid input, and also return that input is valid
  if (strict) {
    e.target.value = oldValue;
    return true;
  }
  return false;
};

export const validateStringLength = (
  e: ChangeEvent<HTMLInputElement>,
  maxLength: number | undefined,
  strictLength: boolean
) => {
  return typeof e.target.value === 'string'
    ? _validateInput(e, _checkLength, [maxLength], strictLength, e.target.value.substring(0, maxLength))
    : true;
};

export const validateRegex = (
  e: ChangeEvent<HTMLInputElement>,
  regexString: string | undefined,
  regexRuleReverse: boolean,
  strictRegex: boolean,
  oldValue: string
) => {
  return _validateInput(e, _checkRegex, [regexString, regexRuleReverse], strictRegex, oldValue);
};

export const validateAdditionalRules = (
  e: ChangeEvent<HTMLInputElement>,
  additionalCheck: Function | undefined,
  additionalStrict: boolean,
  oldValue: string
) => {
  return additionalCheck !== undefined ? _validateInput(e, additionalCheck, [], additionalStrict, oldValue) : true;
};
