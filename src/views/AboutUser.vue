<template>
    <div class="userCard">
        <img 
            v-if="selectedUser.avatar" 
            :src="selectedUser.avatar" 
            :alt="`photo by {{ selectedUser.first_name }}`"
            class="userCard-image"
        >
        <div class="userCard-text">
            <h1>{{ selectedUser.first_name }} {{ selectedUser.last_name }}</h1>
            <h4>{{ selectedUser.email }}</h4>
            <h4 v-if="selectedUser.phone">Phone: {{ selectedUser.phone }}</h4>
            <h4 v-if="selectedUser.address">Address: {{ selectedUser.address }}</h4>
            
            <div>
                <input type="number" id="phoneNumber" v-model="phoneNumber" placeholder="Phone number">
                <button class="btn" @click="addData(phoneNumber, selectedUser, 'phone')">Enter phone</button>
            </div>
            <div>
                <input type="text" id="address" v-model="address" placeholder="Address">
                <button class="btn" @click="addData(address, selectedUser, 'address')">Enter address</button>
            </div>            
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    selectedUser: {
        type: Object,
        required: true,
    }
});

const selectedUser = props.selectedUser;
const phoneNumber = ref('');
const address = ref('');

const addData = (data, user, key) => {
    user[key] = data;
}
</script>

<style scoped> 
.userCard {
    display: flex;
    margin-top: 25px;
    padding: 20px;
    border-radius: 10px;
    background-color: rgb(216, 210, 202);
}

.userCard-image {
    width: 175px;
    height: auto;
    object-fit: contain;
}

.userCard-text {
    margin-left: 20px;
}

input[type="number"]::-webkit-inner-spin-button, 
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
