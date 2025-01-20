export const addPrefix = (str = '', prefix = '') => prefix + str.replace(prefix, '');
export const isRootRelativeURL = (value = '') => value.startsWith('/');