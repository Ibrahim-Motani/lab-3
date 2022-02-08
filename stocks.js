const axios = require("axios");
const { fetchPeople } = require("./people");

async function fetchStocks() {
  const { data } = await axios.get(
    "https://gist.githubusercontent.com/graffixnyc/8c363d85e61863ac044097c0d199dbcc/raw/7d79752a9342ac97e4953bce23db0388a39642bf/stocks.json"
  );
  return data;
}

const shareholdersList = async stockName => {
  const stocks = await fetchStocks();
  const peopleData = await fetchPeople();

  if (!stockName) throw "parameter does not exist";
  if (stockName.trim() === "") throw "parameter can not be empty";
  if (!stocks.some(stock => stock["stock_name"] === stockName))
    throw "does not exist in stock data";

  const stockDetails = stocks.filter(
    stock => stock["stock_name"] === stockName
  )[0];
  if (stockDetails["shareholders"].length < 1) return stockDetails;

  const newShareholdersDetails = stockDetails.shareholders.map(shareholder => {
    const personDetails = peopleData.filter(
      person => person.id === shareholder["userId"]
    )[0];
    const newShareholdersDetails = {};
    newShareholdersDetails["first_name"] = personDetails["first_name"];
    newShareholdersDetails["last_name"] = personDetails["last_name"];
    newShareholdersDetails["number_of_shares"] =
      shareholder["number_of_shares"];
    return newShareholdersDetails;
  });
  stockDetails["shareholders"] = newShareholdersDetails;
  return stockDetails;
};

const totalShares = async stockName => {
  const stocks = await fetchStocks();

  if (!stockName) throw "stockName parameter does not exist";
  if (stockName.trim() === "") throw "stockName parameter can not be empty";
  if (!stocks.some(stock => stock["stock_name"] === stockName))
    throw "stockName does not exist in stock data";

  const stockDetails = stocks.find(stock => stock["stock_name"] === stockName);

  if (stockDetails.shareholders.length < 1)
    return `${stockName}, currently has no shareholders.`;

  return `${stockName}, has ${stockDetails.shareholders.length} ${
    stockDetails["shareholders"].length > 1 ? "shareholders" : "shareholder"
  } that ${
    stockDetails["shareholders"].length > 1 ? "own" : "owns"
  } a total of ${stockDetails["shareholders"].reduce(
    (acc, curr) => (acc += curr["number_of_shares"]),
    0
  )} shares.`;
};

const listStocks = async (firstName, lastName) => {
  const stocks = await fetchStocks();
  const peopleData = await fetchPeople();

  if (!firstName || !lastName) throw "parameter missing";
  if (firstName.trim() === "" || lastName.trim() === "")
    throw "parameter is an empty string";

  const personId = peopleData.filter(
    person =>
      person["first_name"] === firstName && person["last_name"] === lastName
  )[0]["id"];
  if (!personId) throw "does not exist";

  const personStockDetails = [];
  for (let stock of stocks) {
    for (let shareholder of stock["shareholders"]) {
      if (personId === shareholder["userId"]) {
        const temp = {};
        temp["stock_name"] = stock["stock_name"];
        temp["number_of_shares"] = shareholder["number_of_shares"];
        personStockDetails.push(temp);
      }
    }
  }
  return personStockDetails;
};

const getStockById = async id => {
  const stocks = await fetchStocks();

  if (!id) throw "parameter does not exist";
  if (id.trim() === "") throw "parameter can not be empty";

  const stockDetails = stocks.find(stock => stock["id"] === id);
  if (!stockDetails) throw "not found";
  return stockDetails;
};

module.exports = { listShareholders, totalShares, listStocks, getStockById };
