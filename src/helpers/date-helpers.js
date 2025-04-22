function convertYYYYMMDDToUTCDate(dateString) {
    
    // Check if the input follows the YYYY-MM-DD format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      throw new Error('Invalid date format. Please use YYYY-MM-DD format.');
    }
    
    // Split the date string into components
    const [year, month, day] = dateString.split('-').map(part => parseInt(part, 10));
    
    // Month is 0-indexed in JS Date, so subtract 1
    const adjustedMonth = month - 1;
    
    // Create a UTC date object
    const utcDate = new Date(Date.UTC(year, adjustedMonth, day));
    
    // Validate that the date is valid
    if (isNaN(utcDate.getTime())) {
      throw new Error('Invalid date values');
    }
    
    return utcDate;
  }
  
  export { convertYYYYMMDDToUTCDate }