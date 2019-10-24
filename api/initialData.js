import axios from 'axios';

const API_URL =
  'http://app-server16.tradeskillmaster.com/v2/auctiondb/realm/razorgore-horde-eu';

function convertToWowCoinValue(raw) {
  let m = raw;
  const copper = m % 100;
  m = (m - copper) / 100;
  const silver = m % 100;
  const gold = (m - silver) / 100;
  return `${gold}g ${silver}s ${copper}c`;
}

function formatFaultyData(data) {
  // remove brackets, split into array, remove quotes, remove empty field
  const dataRowFields = data
    .substring(
      data.indexOf('fields=') + 'fields='.length,
      data.indexOf('data='),
    )
    .replace('{', '')
    .replace('}', '')
    .replace(new RegExp('"', 'g'), '')
    .split(',')
    .filter(x => x);

  //remove duplicate brackets, match for values inside brackets
  const dataField = data.substring(data.indexOf('data=') + 'data='.length);
  const regexMatched = dataField
    .replace('{{', '{')
    .replace('}}', '}')
    .match(/{.+?}/g);

  const itemsArr = regexMatched.map(item => {
    const splitItem = item
      .replace('{', '')
      .replace('}', '')
      .split(',');

    let obj = {};

    for (let i = 0; i < splitItem.length; i++) {
      if (
        dataRowFields[i] === 'numAuctions' ||
        dataRowFields[i] === 'itemString'
      ) {
        obj[dataRowFields[i]] = splitItem[i];
      } else {
        obj[dataRowFields[i]] = convertToWowCoinValue(splitItem[i]);
      }
    }

    return obj;
  });

  return itemsArr;
}

export default function getCurrentItems() {
  const items = axios
    .get(API_URL)
    .then(response => {
      const {data} = response.data;
      const formatted = formatFaultyData(data);
      return formatted;
    })
    .catch(e => console.log(e));

  return items;
}
