import { defineStore } from 'pinia'

export const usersStore = defineStore('users', {
  state: () => ({
    users: []
  }),
  actions: {
    fetchUsersFromDB() {
      async function fetchAllUsers() {
        let users = [];
        let page = 1;
        // eslint-disable-next-line no-constant-condition
        while (true) {
          try {
            const response = await fetch(`https://reqres.in/api/users?page=${page}`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.data.length === 0) {
              break;
            }
            users = users.concat(data.data);
            page++;
          } catch (error) {
            alert(`Something wrong! ${error.message}`);
            break;
          }
        }
        return users;
      }

      fetchAllUsers().then(users => this.users = users);
    },
  }
})

