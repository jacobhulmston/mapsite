const save = require("./save");
const countries = require("./data/countries");

const firstnames = [
  "Deane",
  "Jamee",
  "Bethann",
  "Lu",
  "Brook",
  "Stefany",
  "Odelia",
  "Angeles",
  "Hattie",
  "Tawana",
  "Catina",
  "Jutta",
  "Andre",
  "Winnifred",
  "Jesusa",
  "Ming",
  "Felecia",
  "Sydney",
  "Abigail",
  "Norris"
];
const surnames = [
  "Dirksen",
  "Hundley",
  "Staub",
  "Sirmans",
  "Kroon",
  "Sackrider",
  "Czaja",
  "Forest",
  "Niccum",
  "Neher",
  "Valero",
  "Tom",
  "Karns",
  "Mateer",
  "Hayslett",
  "Galley",
  "Drum",
  "Opp",
  "Zhu",
  "Arch"
];

const images = ["http://fillmurray.com/200/200"];

const users = [];

let id = 0;
countries.forEach(country => {
  // add users per country
  let nb = 2 + Math.floor(Math.random() * 5);

  for (let i = 0; i < nb; i++) {
    const firstname = firstnames[Math.floor(Math.random() * firstnames.length)];
    const surname = surnames[Math.floor(Math.random() * surnames.length)];

    users.push({
      name: `${firstname} ${surname}`,
      email: `${firstname}.${surname}@gmail.com`,
      favouriteQuote: "this is my favourite quote",
      image: `${images}`,

      country: country.name
    });

    id++;
  }
});

console.log(users.length);

save(
  users,
  () => {
    console.log("Saved");
  },
  "data-users",
  true
);
