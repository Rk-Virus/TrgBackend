// Helper function to format date to dd/mm/yyyy
const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
};

const convertToLowerCase = (obj) => {
    if (typeof obj !== 'object' || obj === null ) {
      throw new Error('Input must be a non-null object');
      
    }
    const convertedObject = {};
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      convertedObject[key] = typeof value === 'string' ? value.toLowerCase() : value;
    });
  
    return convertedObject;
  };

const removeEmptyKeys = (obj) =>{
  // removing keys with empty strings
  let newObj = {}
  for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] !== '') {
        newObj[key] = obj[key];
      }
    }
  return newObj;
}

module.exports = {formatDate, convertToLowerCase, removeEmptyKeys};