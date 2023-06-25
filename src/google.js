import axios from 'axios';

const GOOGLE_API_KEY = 'AIzaSyBEFZ6b-WI6QqRxgYGVDDs7snPDkg9Ud6c';

export const getSheetData = async (google_sheet_id,google_sheet_range) => {
  try {
    const response = await axios.get(
      'https://sheets.googleapis.com/v4/spreadsheets/'
      +google_sheet_id
      +'/values/'
      +google_sheet_range
      +'?key='
      +GOOGLE_API_KEY
    );
    const data = response.data;
    return(data);
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return([]);
  }
};
