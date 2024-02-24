<script setup>
import { ref, watch } from 'vue'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useCurrentUser, useFirebaseAuth } from 'vuefire';

//events
const emit = defineEmits(['cancelregister','registrationcomplete']);


//composables
const auth = useFirebaseAuth();
const user = useCurrentUser();

//component properties
const registrationInfo = ref({email:'',password:'',password_confirm:''});

//functions
async function handleUserRegistration(){
    try {
     let userCredInfo = await createUserWithEmailAndPassword(auth, registrationInfo.value.email, registrationInfo.value.password);
     console.dir(userCredInfo);
    } catch(e) {
        console.log('There was an error registering user.');
        console.dir(e);
    }

}
function cancelUserRegistration(){
    registrationInfo.value.email = '';
    registrationInfo.value.password = '';
    registrationInfo.value.password_confirm = '';
    emit('cancelregister');
}

//watchers
watch(user,async (currentUser, previousUser)=>{
    if(currentUser && !previousUser){
        emit('registrationcomplete');
    }
});

</script>

<template>
    <div class="box">

        <h2 class="is-size-1 is-uppercase has-text-wieght-bold">Register</h2>

        <div class="field">
            <label class="label" for="email">Email</label>
            <div class="control">
                <input name="email" class="input" type="email" v-model="registrationInfo.email" placeholder="Enter Valid Email Address"/>
            </div>
        </div>

        <div class="field">
            <label class="label" for="password">Password</label>
            <div class="control">
                <input type="password" v-model="registrationInfo.password" class="input" name="password" placeholder="Enter Password"/>
            </div>
        </div>

        <div class="field">
            <label class="label" for="confirm_password">Confirm Password</label>
            <div class="control">
                <input type="password" v-model="registrationInfo.password_confirm" class="input" name="confirm_password" placeholder="Confirm Password"/>
            </div>
        </div>

        <div class="field is-grouped">
            <div class="control">
                <a class="button is-primary" v-on:click="handleUserRegistration">Submit</a>
            </div>
            <div class="control">
                <a class="button is-light" v-on:click="cancelUserRegistration">Cancel</a>
            </div>
        </div>

    </div>
</template>