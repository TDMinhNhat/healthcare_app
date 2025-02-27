import { format, parse } from "date-fns";

/**
 * Formats a Date object to a string in dd-MM-yyyy format
 * @param date The Date object to format
 * @returns The formatted date string
 */
export const formatDateToString = (date: Date): string => {
  return format(date, "dd-MM-yyyy");
};

/**
 * Parses a string in dd-MM-yyyy format to a Date object
 * @param dateString The date string to parse
 * @returns The parsed Date object
 */
export const parseDateFromString = (dateString: string): Date => {
  return parse(dateString, "dd-MM-yyyy", new Date());
};

/**
 * Formats a Date object to a string in dd-MM-yyyy-HH-mm-ss format
 * @param date The Date object to format
 * @returns The formatted date and time string
 */
export const formatDateTimeToString = (date: Date): string => {
  return format(date, "dd-MM-yyyy-HH-mm-ss");
};

/**
 * Parses a string in dd-MM-yyyy-HH-mm-ss format to a Date object
 * @param dateTimeString The date and time string to parse
 * @returns The parsed Date object
 */
export const parseDateTimeFromString = (dateTimeString: string): Date => {
  return parse(dateTimeString, "dd-MM-yyyy-HH-mm-ss", new Date());
};

/**
 * Converts a Date to ISO string format
 * @param date The Date object
 * @returns ISO string representation
 */
export const toISOString = (date: Date): string => {
  return date.toISOString();
};

/**
 * Returns the current date formatted as dd-MM-yyyy
 * @returns Current date string
 */
export const getCurrentDateString = (): string => {
  return formatDateToString(new Date());
};

/**
 * Returns the current date and time formatted as dd-MM-yyyy-HH-mm-ss
 * @returns Current date and time string
 */
export const getCurrentDateTimeString = (): string => {
  return formatDateTimeToString(new Date());
};
