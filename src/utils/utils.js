export const addPrefix = (str = '', prefix = '') => prefix + str.replace(prefix, '');
export const isRelativeURL = (value = '') => value.startsWith('/');