import { parseISO, isValid as isValidDate, isAfter, isBefore, isEqual, differenceInDays, startOfDay } from 'date-fns';

//for some reason date-fns doesn't include these functions

export const sameOrAfter = (date: number | Date, dateToCompare: number | Date) => {
  return isEqual(date, dateToCompare) || isAfter(date, dateToCompare);
};

export const sameOrBefore = (date: number | Date, dateToCompare: number | Date) => {
  return isEqual(date, dateToCompare) || isBefore(date, dateToCompare);
};

export const sameDayOrAfter = (date: number | Date, dateToCompare: number | Date) => {
  return sameOrAfter(startOfDay(date), startOfDay(dateToCompare));
};

export const sameDayOrBefore = (date: number | Date, dateToCompare: number | Date) => {
  return sameOrBefore(startOfDay(date), startOfDay(dateToCompare));
};

export const getDate = (date: string | Date) => {
  return typeof date === 'string' ? parseISO(date) : date;
};

export const checkIsDaysValid = (days: string, maxDays: number, startDate: Date, toDate: Date) => {
  const value = parseInt(days, 10);
  if (isNaN(value)) {
    return false;
  }
  const diff = differenceInDays(startOfDay(toDate), startOfDay(startDate)) + 1;
  return value >= 1 && value <= maxDays && (isNaN(diff) || diff < 1 ? true : value <= diff);
};

// The two date check methods are basically the same but inverted
export const checkIsStartDateValid = (
  input: string,
  endDateStr: string | Date,
  days: number | string,
  maxDays: number,
  setIsDaysValid: Function,
  setIsEndDateValid: Function
) => {
  const startDate = parseISO(input);
  const endDate = getDate(endDateStr);
  setIsDaysValid(checkIsDaysValid(days.toString(), maxDays, startDate, endDate));
  const isStartDateValid = isValidDate(startDate);
  //Check if end date is valid here instead of using isEndDateValid variable, because we need to know only
  //if it's a correct date, not any other logic associated with validity in the form
  const isEndDateValid = isValidDate(endDate);
  if (isStartDateValid) {
    if (isEndDateValid) {
      const isStartDateBeforeEndDate = isBefore(startOfDay(startDate), startOfDay(endDate));
      setIsEndDateValid(sameDayOrAfter(endDate, new Date()) && isStartDateBeforeEndDate);
      return sameDayOrAfter(startDate, new Date()) && isStartDateBeforeEndDate;
    } else {
      setIsEndDateValid(false);
      return sameDayOrAfter(startDate, new Date());
    }
  } else {
    if (isEndDateValid) {
      setIsEndDateValid(sameDayOrAfter(endDate, new Date()));
      return false;
    } else {
      setIsEndDateValid(false);
      return false;
    }
  }
};

export const checkIsEndDateValid = (
  input: string,
  startDateStr: string | Date,
  days: number | string,
  maxDays: number,
  setIsDaysValid: Function,
  setIsStartDateValid: Function
) => {
  const startDate = getDate(startDateStr);
  const endDate = parseISO(input);
  setIsDaysValid(checkIsDaysValid(days.toString(), maxDays, startDate, endDate));
  const isStartDateValid = isValidDate(startDate);
  const isEndDateValid = isValidDate(endDate);
  if (isStartDateValid) {
    if (isEndDateValid) {
      const isStartDateBeforeEndDate = isBefore(startOfDay(startDate), startOfDay(endDate));
      setIsStartDateValid(sameDayOrAfter(startDate, new Date()) && isStartDateBeforeEndDate);
      return sameDayOrAfter(endDate, new Date()) && isStartDateBeforeEndDate;
    } else {
      setIsStartDateValid(sameDayOrAfter(startDate, new Date()));
      return false;
    }
  } else {
    if (isEndDateValid) {
      setIsStartDateValid(false);
      return sameDayOrAfter(endDate, new Date());
    } else {
      setIsStartDateValid(false);
      return false;
    }
  }
};
