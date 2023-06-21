import axios from 'axios';

const GOOGLE_SHEET_ID = '1OY9MmoBY2r3wU2kk9puaqSXMQIQd-xZVANloT0bVd3U';
const GOOGLE_API_KEY = 'AIzaSyBEFZ6b-WI6QqRxgYGVDDs7snPDkg9Ud6c';
const GOOGLE_SHEET_RANGLE = 'June10-July2!A12:F16';

export const getSheetData = async () => {
  try {
    const response = await axios.get(
      'https://sheets.googleapis.com/v4/spreadsheets/'
      +GOOGLE_SHEET_ID
      +'/values/'
      +GOOGLE_SHEET_RANGLE
      +'?key='
      +GOOGLE_API_KEY
    );
    const data = response.data;
    console.log(data.values);
    return(data.values);
  } catch (error) {
    console.error('Error fetching sheet data:', error);
  }
};
