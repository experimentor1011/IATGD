<script setup>
import { ref, watch } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useCurrentUser, useFirebaseAuth } from 'vuefire';

//composables
const auth = useFirebaseAuth();
const user = useCurrentUser();

//component properties
const loginInfo = ref({username:'',password:''});

//functions
async function login(){
    try {
         let userCreds = await signInWithEmailAndPassword(auth, loginInfo.value.username, loginInfo.value.password);
         console.log('User Logged In:');
         console.dir(userCreds);
    } catch(e) {
        console.log('there was a problem signing the user in.');
        console.dir(e);
    }
}

//watchers
watch(user,async(currentUser, previousUser)=>{
    if(currentUser){
        console.log('User Signed In');
        console.dir(currentUser);
    }
});

</script>

<template>
    <div class="box">
        <h2 class="is-size-1 is-uppercase has-text-wieght-bold">Login</h2>

        <div class="field">
            <label class="label" for="username">Username (Email Address)</label>
            <div class="control">
                <input class="input" name="username" type="email" placeholder="Username" v-model="loginInfo.username"/>
            </div>
        </div>

        <div class="field">
            <label class="label" for="password">Password</label>
            <div class="control">
                <input class="input" name="password" type="password" placeholder="Password" v-model="loginInfo.password"/>
            </div>
        </div>

        <div class="field is-grouped">
            <div class="control">
                <a class="button is-primary" v-on:click="login">Login</a>
            </div>
        </div>
    </div>
</template>