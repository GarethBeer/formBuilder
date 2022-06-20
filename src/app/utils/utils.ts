
export const isObject = (obj: any): boolean => {
 return  obj != null && typeof obj === 'object' && !Array.isArray(obj)
};

export const isDate = (date: any) => {
  return date instanceof Date
};


export const isEmpty = (obj: any) => {
  return Object.keys(obj).length === 0
};

export const hasOwnProperty = (obj: any, key: any) => {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

export const isEmptyObject = (obj: any) => {
  return isObject(obj) && isEmpty(obj)
};

export const findChanges = (prev: any, curr: any) => {
  if (prev === curr) return {}
  if (!isObject(prev) || !isObject(curr)) return curr

  const deletedValues = Object.keys(prev).reduce((acc: any, key: any) => {
    if (!hasOwnProperty(curr, key)) {
      acc[key] = undefined;
    }
    return acc;
  }, {});

  if (isDate(prev) || isDate(curr)) {
    if (prev.valueOf() == curr.valueOf()) return {};
    return curr;
  }

  return Object.keys(curr).reduce((acc: any, key: any) => {
    if (!hasOwnProperty(prev, key)) {
      acc[key] = curr[key]; // return added r key
      return acc;
    }

    const difference = findChanges(prev[key], curr[key]);

    if (isEmptyObject(difference) && !isDate(difference) && (isEmptyObject(prev[key]) || !isEmptyObject(curr[key])))
      return acc; // return no diff

    acc[key] = difference // return updated key
    return acc; // return updated key
  }, deletedValues);
};

export const addedDiff = (prev:any, curr:any) => {

  if (prev === curr || !isObject(prev) || !isObject(curr)) return {};

  const l = prev;
  const r = curr;

  return Object.keys(r).reduce((acc:any, key) => {
    if (hasOwnProperty(l, key)) {
      const difference = addedDiff(l[key], r[key]);

      if (isObject(difference) && isEmpty(difference)) return acc;

      acc[key] = difference;
      return acc;
    }

    acc[key] = r[key];
    return acc;
  }, {});
};

 export const deletedDiff = (lhs: any, rhs: any) => {
  if (lhs === rhs || !isObject(lhs) || !isObject(rhs)) return {};

  const l = lhs;
  const r = rhs;

  return Object.keys(l).reduce((acc: any, key) => {
    if (hasOwnProperty(r, key)) {
      const difference = deletedDiff(l[key], r[key]);

      if (isObject(difference) && isEmpty(difference)) return acc;

      acc[key] = difference;
      return acc;
    }

    acc[key] = undefined;
    return acc;
  }, {});
};

export const updatedDiff = (prev:any, curr:any) => {
  if (prev === curr) return {};


  if (!isObject(prev) || !isObject(curr)) return curr;

  const l = prev;
  const r = curr;

  if (isDate(l) || isDate(r)) {
    if (l.valueOf() == r.valueOf()) return {};
    return r;
  }

  return Object.keys(r).reduce((acc: any, key) => {
    if (hasOwnProperty(l, key)) {
      const difference = updatedDiff(l[key], r[key]);

      // If the difference is empty, and the lhs is an empty object or the rhs is not an empty object
      if (isEmptyObject(difference) && !isDate(difference) && (isEmptyObject(l[key]) || !isEmptyObject(r[key])))
        return acc; // return no diff

      acc[key] = difference;
      return acc;
    }

    return acc;
  }, {});
};

export const detailedDiff = (lhs: any, rhs:any) => ({
  added: addedDiff(lhs, rhs),
  deleted: deletedDiff(lhs, rhs),
  updated: updatedDiff(lhs, rhs),
});

export const checkObjectPropertyValue = (first: any, second: any, matcher: string) => {
  return  first[matcher] === second[matcher]
 }

 export const checkObjectProperties = (first: any, second: any): any => {
   return Object.entries(first).find((el:any) => el[1].Id === second.Id)
 }

 export const checkNestedProperties = (first: any, second: any) => {
   Object.entries(first).forEach((el:any) => {
     if (typeof el[1] === 'object') {
       if (el[1] && !isEmptyObject(el[1]) && hasOwnProperty(el[1], 'Id')) {
         el[1].Id === second.Id ? (first[el[0]] = second) : checkNestedProperties(el[1], second)
       }
     }
   })
   return first;
 }
