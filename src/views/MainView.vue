<script setup>
import { ref, computed } from 'vue';
import { useCurrentUser, useFirebaseAuth} from 'vuefire';
import MainNavigation from '@/components/MainNavigation.vue';
import EventForm from '@/components/events/EventForm.vue';

//composables
const user = useCurrentUser();
const auth = useFirebaseAuth();

//computed properties
const userId = computed(()=>{
    console.log('User Info: %s',JSON.stringify(user.value,null,"\t"));
    return user.value.uid;
});

//component properties
const displayEventForm = ref(false);
const eventList = ref([]);


</script>

<template>
    <div v-if="displayEventForm" class="modal">
        <div class="modal-background"></div>
        <div class="modal-content">
            <EventForm v-bind:user-id="userId"></EventForm>
        </div>
        <button class="modal-close is-large" aria-label="close" v-on:click="displayEventForm = false"></button>
    </div>
    <header>
        <MainNavigation></MainNavigation>
    </header>
    <section>
        <div class="container is-max-desktop">
            <div class="columns">
                <div v-if="!displayEventForm" class="column is-full">
                    <a button class="button is-primary" v-on:click="displayEventForm = true">New Event</a>
                </div>
            </div>
        </div>
    </section>
    <footer class="footer">
        
    </footer>
</template>