module.exports = (obj, ...alloweFields) => {
  const newObj = {};
  Object.keys(obj).forEach((elm) => {
    if (alloweFields.includes(elm)) newObj[elm] = obj[elm];
  });
  return newObj;
};
