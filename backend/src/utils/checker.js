const isEmptyObject = (object) => {
  if (!object || typeof object !== 'object') return true;
  return Object.keys(object).length === 0;
};

const isFunction = (it) => !!(it && it.constructor && it.call && it.apply);

module.exports = {
  isEmptyObject,
  isFunction,
};
