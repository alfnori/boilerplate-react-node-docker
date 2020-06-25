
const { isEmptyObject } = require('../../utils/checker');
const { logDatabase } = require('../../utils/logger');
const {
  parseJSON, sanitize, sanitizerEscape, transpileObject,
} = require('../../utils/transformer');


const mongooseRegex = (str) => ({ $regex: new RegExp(sanitizerEscape(str)), $options: 'ig' });

const assertFilter = (config) => {
  if (!config || (!config.filter && !config.search)) return {};
  const search = sanitize(config.search);
  let filter;
  if (search) {
    filter = {
      name: search,
      email: search,
      document: search,
    };
  } else {
    filter = parseJSON(config.filter, {});
  }
  let resultFilter = {};
  if (filter.name) resultFilter.name = mongooseRegex(filter.name);
  if (filter.email) {
    const email = mongooseRegex(filter.email);
    if (search) {
      resultFilter['email.work'] = email;
      resultFilter['email.personal'] = email;
    } else {
      resultFilter.$or = [];
      resultFilter.$or.push({ 'email.work': email });
      resultFilter.$or.push({ 'email.personal': email });
    }
  }
  if (filter.document) resultFilter.document = mongooseRegex(filter.document.replace(/[^\w]/, ''));
  if (isEmptyObject(resultFilter)) return {};
  if (search) {
    resultFilter = { $or: transpileObject(resultFilter) };
  } else {
    resultFilter = { $and: transpileObject(resultFilter) };
  }
  logDatabase(`FILTER: ${JSON.stringify(resultFilter)}`);
  return resultFilter;
};

const assertOrder = (config) => {
  if (!config || !config.sort) return {};
  const sort = parseJSON(config.sort);
  let resultSort = transpileObject(sort,
    (o, k, v) => {
      const availableSort = ['name', 'document', 'department', 'employmentStatus'].indexOf(k) >= 0;
      const availableSortType = ['asc', 'desc', 'ascending', 'descending', 1, -1].indexOf(v) >= 0;
      if (availableSort && availableSortType) {
        return [k, v];
      }
      return undefined;
    }, true);
  resultSort = resultSort.filter(Boolean);
  logDatabase(`SORT: ${JSON.stringify(resultSort)}`);
  return resultSort;
};

const assertLimit = (config) => {
  const limit = parseInt(config.limit, 10);
  logDatabase(`LIMIT: ${limit}`);
  return limit;
};

const assertSkip = (config) => {
  let skip = parseInt(config.skip, 10);
  const page = parseInt(config.page, 10);
  if (page > 1) {
    const limit = assertLimit(config);
    skip = (page - 1) * limit;
  }
  logDatabase(`SKIP: ${skip}`);
  return skip;
};

module.exports = {
  assertFilter,
  assertOrder,
  assertLimit,
  assertSkip,
};
