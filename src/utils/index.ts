/**
 * Utility functions for the application
 */
export const classNames = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

export const formatDelay = (index: number, base = 0.05) => {
  return index * base;
};
