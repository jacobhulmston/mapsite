function fetchUsers() {
  return fetch(
    "https://eus483eenc.execute-api.eu-west-2.amazonaws.com/TestGate/get-users"
  ).then(resp => resp.json());
}

export default fetchUsers;
