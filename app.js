const {
  getPersonById,
  manipulateIp,
  sameBirthday,
  sameEmail,
  getPeople,
} = require("./people");
const {
  listShareholders,
  totalShares,
  listStocks,
  getStockById,
} = require("./stocks");
async function main() {
  try {
    const peopleData = await getPeople();
    console.log(peopleData);
  } catch (error) {
    console.log(error);
  }

  try {
    const result = await getPersonById("7989fa5e-8f3f-458d-ad58-23c8d9ef5a10");
    console.log(result);
  } catch (error) {
    console.log(error);
  }

  try {
    const result = await sameEmail("harvard.edu");
    console.log(result);
  } catch (error) {
    console.log(error);
  }

  try {
    const result = await manipulateIp();
    console.log(result);
  } catch (error) {
    console.log(error);
  }

  try {
    const result = await sameBirthday(9, 25);
    console.log(result);
  } catch (error) {
    console.log(error);
  }

  try {
    const result = await listShareholders("Aeglea BioTherapeutics, Inc.");
    console.log(result);
  } catch (error) {
    console.log(error);
  }

  try {
    const result = await totalShares("Powell Industries, Inc.");
    console.log(result);
  } catch (error) {
    console.log(error);
  }

  try {
    const result = await listStocks("Grenville", "Pawelke");
    console.log(result);
  } catch (error) {
    console.log(error);
  }

  try {
    const result = await getStockById("f652f797-7ca0-4382-befb-2ab8be914ff0");
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

main();