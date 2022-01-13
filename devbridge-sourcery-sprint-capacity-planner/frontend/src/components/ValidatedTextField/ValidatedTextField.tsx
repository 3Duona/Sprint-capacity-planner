import React, { useState, ChangeEvent } from 'react';
import { TextField, TextFieldProps } from '@material-ui/core';
import _ from 'lodash';

import { validateStringLength, validateRegex, validateAdditionalRules } from './ValidationHelpers';

type ValidatedTextFieldProps = TextFieldProps & {
  validationProps: {
    isValid: boolean;
    setIsValid: Function;
    maxLength?: number;
    strictLength?: boolean;
    regexString?: string;
    strictRegex?: boolean;
    regexRuleReverse?: boolean;
    isDirty?: boolean;
    setIsDirty?: Function;
    additionalCheck?: Function;
    additionalStrict?: boolean;
  };
  value: string;
};

const ValidatedTextField: React.FC<ValidatedTextFieldProps> = ({
  validationProps: {
    maxLength,
    strictLength = false,
    regexString,
    strictRegex = false,
    regexRuleReverse = false,
    isValid,
    setIsValid,
    isDirty,
    setIsDirty,
    additionalCheck,
    additionalStrict = false,
  },
  onChange,
  value,
  ...textFieldProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const isErroneous = !isValid && (isDirty !== undefined ? isDirty : true) && !_.isEmpty(value);

  const onFocus = () => setIsFocused(true);
  const onBlur = () => setIsFocused(false);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (setIsDirty !== undefined) {
      setIsDirty(true);
    }
    // checking is done in a single expression with functions to improve performance
    // empty is the second, because we want to check the user given rules first
    setIsValid(
      validateAdditionalRules(e, additionalCheck, additionalStrict, value) &&
        !_.isEmpty(e.target.value) &&
        validateStringLength(e, maxLength, strictLength) &&
        validateRegex(e, regexString, regexRuleReverse, strictRegex, value)
    );
    if (onChange !== undefined) {
      onChange(e);
    }
  };

  return (
    <TextField
      error={isErroneous && !isFocused}
      FormHelperTextProps={{ error: isErroneous }}
      onBlur={onBlur}
      onChange={onInputChange}
      onFocus={onFocus}
      required
      value={value}
      {...textFieldProps}
    />
  );
};

export default ValidatedTextField;
