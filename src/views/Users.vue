<template>
    <div class="header">
        <div class="block">
            <input type="text" v-model="name" placeholder="Full Name">
            <input type="text" v-model="email" placeholder="email@example.com">
            <button class="btn" @click="addUser">Add user</button>
        </div>

        <div class="block">
            <h2> Filter by name</h2>
            <input 
                class="input"
                type="text" 
                v-model="filterPhrase" 
                placeholder="Enter name" 
            >
            <h2 v-if="filterPhrase">{{ filteredUsers.length }} matches by filter</h2>
        </div>
    </div>
    

    <div v-if="selectedUser.length" class="cover-div"></div>
    <div v-if="selectedUser.length" class="wrapper sticky">
        <button class="btn closeBtn" @click="selectedUser = []">X</button>
        <AboutUser :selectedUser="selectedUser[0]" />
    </div>

    
    
    <div 
        class="users-list" 
        v-if="usersArray = filterPhrase 
            ? filteredUsers
            : store.users"
    >
        <div 
            class="user" 
            v-for="user in usersArray" 
            :key="user.id" 
        >
            <img 
                v-if="user.avatar"
                :src="user.avatar" 
                :alt="`photo by {{ user.first_name }}`"
            >
            <h2 
                class="name"
                @click="showUserInfo(user)"
            >
                {{ user.first_name }}
            </h2>
            <p>{{ user.email }}</p>
            <button class="btn closeBtn deleteBtn" @click="deleteUser(user.id)">Delete user</button>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'UsersView'
});
</script>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { usersStore } from '@/stores/users';
import AboutUser from '@/views/AboutUser.vue'

const store = usersStore();

const name = ref('');
const email = ref('');
const selectedUser = ref([]);
const filterPhrase = ref('');

const filteredUsers = computed(() => {
    return store.users.filter((user) =>
        (user.first_name + user.last_name).toLowerCase()
            .includes(filterPhrase.value.toLowerCase())
    );
});

const showUserInfo = (user) => {
    selectedUser.value.push(user);
}

function validateEmail(email) {
    // eslint-disable-next-line no-useless-escape
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validateName(name) {
    var words = name.trim().split(' ');
    return words.length >= 2;
}

const addUser = async () => {
    if (!validateEmail(email.value)) {
        alert('Email not correct!');
        return;
    }

    if (!validateName(name.value)) {
        alert('Please enter full name');
        return;
    }

    try {
        const newName = name.value.split(" ");

        const firstName = newName[0];
        const lastName = newName[1];

        const response = await fetch('https://reqres.in/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email: email.value
            })
        })

        if (response.ok) {
            alert('User successfully added!');

            const newUser = await response.json();

            store.users.push(newUser);
        } else {
            alert('Something went wrong!');
        }
    } catch (error) {
        alert('Error!:', error);
    }

    name.value = '';
    email.value = '';
}


const deleteUser = async (userId) => {
    fetch(`https://reqres.in/api/users/${userId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error('Something went wrong!');
        }
    })
    // eslint-disable-next-line no-unused-vars
    .then(_data => alert('User deleted'))
    .catch(error => alert('Error:', error));

    store.users = store.users.filter((user) => user.id !== userId)
}

onMounted(() => {
    store.fetchUsersFromDB()
})
</script>

<style scoped>
.header {
    position: absolute;
    top: 20px;
    left: 30px;
}
.block {
    display: flex;
    flex-direction: column;
    width: 300px;
}
.input {
    width: 300px;
}
.users-list {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap; 
    position: absolute; 
    top: 230px;
    left: 20px;  
}

.user {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 220px;
    min-width: 200px;
    margin: 8px;
    padding: 16px;
    box-shadow: 0 0 14px 0 #ffffff;
    border-radius: 10px;
}

.user:hover {
    transform: scale(1.05);
    box-shadow : 0 0 14px 0 #5a5a5a;
}

.name:hover {
    box-shadow : 0 0 14px 0 #5a5a5a;
    transform: scale(1.05);
    cursor: pointer;
}

.user img {
    width: 50%;
    border-radius: 5px;
}

.cover-div {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
    width: 100%;
    height: 100%;
    background-color: rgb(0, 0, 0);
    opacity: 0.8;
    transform: scale(1.5);
}

.wrapper {
    position: absolute;
    top: 60px;
    left: 50%;
    width: 450px;
    height: 90vh;
    transform: translate(-50%, 0);
    z-index: 10;
}

.closeBtn {
    background-color: #ad8482;
    padding: 10px 15px;
    border-radius: 12px;
}

.closeBtn:hover {
    background-color: #e60000;
}

.closeBtn:active {
    background-color: #b30000;
}

.deleteBtn {
    padding: 3px 8px;
    border-radius: 3px;
}
</style>