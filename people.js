const axios = require("axios");

async function getPeople() {
  const { data } = await axios.get(
    "https://gist.githubusercontent.com/graffixnyc/a1196cbf008e85a8e808dc60d4db7261/raw/9fd0d1a4d7846b19e52ab3551339c5b0b37cac71/people.json"
  );
  return data;
}

const getPersonById = async id => {
  const peopleData = await getPeople();

  if (!id) throw "Id paramter should be supplied.";
  if (typeof id !== "string") throw "Id should be a string";
  if (id.trim() === "") throw "Id is empty spaces";

  const foundPerson = peopleData.find(person => person.id === id);

  if (foundPerson.length < 1) throw "Person not found";
  return foundPerson;
};

const sameEmail = async domain => {
  const peopleData = await getPeople();

  if (!domain) throw "Email Domain parameter not supplied";
  if (domain.trim() === "") throw "Empty email domain supplied";
  if (!domain.includes(".")) throw "Email Domain does not contain a .";
  if (domain.substr(domain.lastIndexOf(".") + 1).length < 2)
    throw "Email domain has less than 2 characters afet the dot";

  const providedDomain = domain.substr(domain.lastIndexOf("@") + 1);
  const sameEmails = peopleData.filter(obj => {
    const domainToBeChecked = obj.email.substr(obj.email.lastIndexOf("@") + 1);
    return providedDomain === domainToBeChecked;
  });

  if (sameEmails.length < 2)
    throw "Not moree than 2 people have the same email domain";
  return sameEmails;
};

const manipulateIp = async () => {
  const peopleData = await getPeople();

  const newData = peopleData.map(obj => {
    const newObj = {};
    newObj["first_name"] = obj["first_name"];
    newObj["last_name"] = obj["last_name"];
    newObj["ip_address"] = obj["ip_address"]
      .split(".")
      .join("")
      .split("")
      .sort((a, b) => a - b)
      .join("");
    return newObj;
  });

  const highestPerson = {
    firstName: newData[0]["first_name"],
    lastName: newData[0]["last_name"],
  };
  const lowestPerson = {
    firstName: newData[0]["first_name"],
    lastName: newData[0]["last_name"],
  };
  let sum = 0;
  let highest = newData[0]["ip_address"];
  let lowest = newData[0]["ip_address"];

  for (let obj of newData) {
    if (obj["ip_address"] > highest) {
      highest = obj["ip_address"];
      highestPerson.firstName = obj["first_name"];
      highestPerson.lastName = obj["last_name"];
    }
    if (obj["ip_address"] < lowest) {
      lowest = obj["ip_address"];
      lowestPerson.firstName = obj["first_name"];
      lowestPerson.lastName = obj["last_name"];
    }
    sum = sum + obj["ip_address"];
  }

  return {
    highest: highestPerson,
    lowest: lowestPerson,
    average: sum / newData.length,
  };
};

const sameBirthday = async (month, day) => {
  const peopleData = await getPeople();

  if (!month && !day) throw "Month or Day parameter is not present";
  if (typeof Number(month) !== "number" || typeof Number(day) !== "number")
    throw "Month or Day argument is not a number";
  if (month < 1 || month > 12)
    throw "Month cannot be greater than 12 or less than 1";
  if (month === 2) {
    if (day > 29 || day < 1)
      throw "In the month of February only 29 days are valid";
  }
  if (
    month === 1 ||
    month === 3 ||
    month === 5 ||
    month === 7 ||
    month === 8 ||
    month === 10 ||
    month === 12
  ) {
    if (day < 1 && day > 31)
      throw "In the months of 1, 3, 5, 7, 8, 10 and 12 days should be less than 32";
  }
  if (month === 4 || month === 6 || month === 9 || month === 11) {
    if (day < 1 && day > 30)
      throw "In the months of 4, 6, 9 and 11 days should be less than 31";
  }
  const result = [];
  for (let obj of peopleData) {
    const objDate = obj["date_of_birth"].split("/");
    if (month == objDate[0] && day == objDate[1])
      result.push(`${obj["first_name"]} ${obj["last_name"]}`);
  }
  if (result.length === 0) throw "There are no peoplpe with given birthdate";
  return result;
};

module.exports = {
  sameBirthday,
  getPersonById,
  manipulateIp,
  sameEmail,
  getPeople,
};
