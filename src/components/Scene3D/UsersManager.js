import fetchUsers from "./data/fetchUsers";

class UsersManager {
  constructor() {
    this.mapUserCountries = {};
  }
  init = async () => {
    this.users = await fetchUsers();
    this.users.forEach(user => {
      const c = user.country;

      if (!this.mapUserCountries[c])
        this.mapUserCountries[c] = { nbUsers: 0, users: [] };
      this.mapUserCountries[c].nbUsers++;
      this.mapUserCountries[c].users.push(user);
    });
  };

  getUsersPerCountry(country) {
    return this.mapUserCountries[country];
  }
}

export default new UsersManager();
