const axios = require("axios");
const { getPeople } = require("./people");

async function getStocks() {
  const { data } = await axios.get(
    "https://gist.githubusercontent.com/graffixnyc/8c363d85e61863ac044097c0d199dbcc/raw/7d79752a9342ac97e4953bce23db0388a39642bf/stocks.json"
  );
  return data;
}

const listShareholders = async stockName => {
  const stocks = await getStocks();
  const peopleData = await getPeople();

  if (!stockName) throw "stockName parameter does not exist";
  if (stockName.trim() === "") throw "stockName parameter can not be empty";
  if (!stocks.some(stock => stock["stock_name"] === stockName))
    throw "stockName does not exist in stock data";

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
  const stocks = await getStocks();

  if (!stockName) throw "stockName parameter does not exist";
  if (stockName.trim() === "") throw "stockName parameter can not be empty";
  if (!stocks.some(stock => stock["stock_name"] === stockName))
    throw "stockName does not exist in stock data";

  const stockDetails = stocks.find(stock => stock["stock_name"] === stockName);

  if (stockDetails.shareholders.length < 1)
    return `${stockName}, currently has no shareholders.`;

  const totalNumberOfShares = stockDetails["shareholders"].reduce(
    (acc, curr) => (acc += curr["number_of_shares"]),
    0
  );
  const word1 =
    stockDetails["shareholders"].length > 1 ? "shareholders" : "shareholder";
  const word2 = stockDetails["shareholders"].length > 1 ? "own" : "owns";
  return `${stockName}, has ${stockDetails.shareholders.length} ${word1} that ${word2} a total of ${totalNumberOfShares} shares.`;
};

const listStocks = async (firstName, lastName) => {
  const stocks = await getStocks();
  const peopleData = await getPeople();

  if (!firstName || !lastName) throw "firstName or lastName parameter missing";
  if (firstName.trim() === "" || lastName.trim() === "")
    throw "firstName or lastName is an empty string";

  const personId = peopleData.find(
    person =>
      person["first_name"] === firstName && person["last_name"] === lastName
  )["id"];
  if (!personId) throw "Person does not exist";

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
  const stocks = await getStocks();

  if (!id) throw "id parameter does not exist";
  if (id.trim() === "") throw "id parameter can not be empty";
  if (!stocks.some(stock => stock["id"] === id)) throw "stock not found";

  const stockDetails = stocks.find(stock => stock["id"] === id);
  return stockDetails;
};

module.exports = { listShareholders, totalShares, listStocks, getStockById };
