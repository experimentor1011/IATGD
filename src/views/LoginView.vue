<script setup>
    import { ref, watch } from 'vue';
    import { useCurrentUser, useFirebaseAuth } from 'vuefire';
    import { useRoute, useRouter } from 'vue-router';
    import LoginForm from '@/components/LoginForm.vue';
    import UserRegistration from '@/components/UserRegistration.vue';

    //composables
    const auth = useFirebaseAuth();
    const user = useCurrentUser();
    const route = useRoute();
    const router = useRouter();

    //component properties
    const showRegistration = ref(false);

    //watchers
    watch(user,( currentUser, previousUser )=>{
        //if user signed in and a redirect has been set, forwward to redirect route
        if(currentUser && typeof route.query.redirect === 'string'){
            router.push(route.query.redirect);
        }
        //if user signed in, but no redirect has been set, redirect to default authenticated page
        if(currentUser){
            console.log('User Signed in');
            console.dir(currentUser);
        }
    });
</script>

<template>
    <section class="container is-max-desktop">
        <div v-if="!showRegistration">
            <LoginForm></LoginForm>
            <div class="container has-text-centered">
                <a class="button is-text" v-on:click="showRegistration = true">Register</a>
            </div>
        </div>
        <div v-if="showRegistration">
            <UserRegistration></UserRegistration>
            <div class="container has-text-centered">
                <a class="button is-text" v-on:click="showRegistration = false">Login</a>
            </div>
        </div>
    </section>
</template>