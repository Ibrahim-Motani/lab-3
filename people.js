const axios = require("axios");

async function fetchPeople() {
  const { data } = await axios.get(
    "https://gist.githubusercontent.com/graffixnyc/a1196cbf008e85a8e808dc60d4db7261/raw/9fd0d1a4d7846b19e52ab3551339c5b0b37cac71/people.json"
  );
  return data;
}

const fetchPersonById = async id => {
  const people = await fetchPeople();

  if (!id) throw "paramter should be supplied.";
  if (typeof id !== "string") throw "parameter should be a string";
  if (id.trim() === "") throw "paramter is empty spaces";

  const person = people.find(person => person.id === id);

  if (person.length < 1) throw "not found";
  return person;
};

const similarEmails = async emailDomain => {
  const people = await fetchPeople();

  if (!emailDomain) throw "Email Domain parameter not supplied";
  if (emailDomain.trim() === "") throw "Empty email domain supplied";
  if (!emailDomain.includes(".")) throw "Email Domain does not contain a .";
  if (emailDomain.substr(emailDomain.lastIndexOf(".") + 1).length < 2)
    throw "Email domain has less than 2 characters afet the dot";

  const providedDomain = domain.substr(emailDomain.lastIndexOf("@") + 1);
  const sameDomainEmails = people.filter(person => {
    const domainToBeChecked = person.email.substr(person.email.lastIndexOf("@") + 1);
    return providedDomain === domainToBeChecked;
  });

  if (sameDomainEmails.length < 2)
    throw "Not moree than 2 people have the same email domain";
  return sameDomainEmails;
};

const ipManipulation = async () => {
  const people = await fetchPeople();

  const newPeopleData = people.map(obj => {
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

  const highestIpPerson = {
    firstName: newPeopleData[0]["first_name"],
    lastName: newPeopleData[0]["last_name"],
  };
  const lowestIpPerson = {
    firstName: newPeopleData[0]["first_name"],
    lastName: newPeopleData[0]["last_name"],
  };
  let sum = 0;
  let highestIp = newPeopleData[0]["ip_address"];
  let lowestIp = newPeopleData[0]["ip_address"];

  for (let obj of newPeopleData) {
    if (obj["ip_address"] > highestIp) {
      highestIp = obj["ip_address"];
      highestIpPerson.firstName = obj["first_name"];
      highestIpPerson.lastName = obj["last_name"];
    }
    if (obj["ip_address"] < lowestIp) {
      lowest = obj["ip_address"];
      lowestIpPerson.firstName = obj["first_name"];
      lowestIpPerson.lastName = obj["last_name"];
    }
    sum = sum + obj["ip_address"];
  }

  return {
    highest: highestIpPerson,
    lowest: lowestIpPerson,
    average: sum / newPeopleData.length,
  };
};

const similarDateOfBirth = async (month, day) => {
  const people = await fetchPeople();

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
  for (let person of people) {
    const objDate = person["date_of_birth"].split("/");
    if (month == objDate[0] && day == objDate[1])
      result.push(`${person["first_name"]} ${person["last_name"]}`);
  }
  if (result.length === 0) throw "There are no peoplpe with given birthdate";
  return result;
};