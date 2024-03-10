<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import { useCurrentUser, useFirestore } from 'vuefire';
import { collection, getDocs } from '@firebase/firestore';
import { DateTime } from 'luxon';
import MainNavigation from '@/components/MainNavigation.vue';
import EventForm from '@/components/events/EventForm.vue';

//composables
const user = useCurrentUser();
const db = useFirestore();
const collectionRef = collection(db,'events');

//computed properties
const userId = computed(()=>{
    return user.value.uid;
});
const mapApiKey = computed(()=>{
    return import.meta.env.VITE_GOOGLE_APIKEY;
});
const mapApiUri = computed(()=>{
    return `https://maps.googleapis.com/maps/api/staticmap?key=${mapApiKey.value}`;
});

//interal properties
const eventList = ref([]);
const noEvents = ref(false);

//component properties
const displayEventForm = ref(false);

onBeforeMount(async () => {
    try {
        let results = await getDocs(collectionRef);
        eventList.value = results.docs.map( doc => {
            let { address, date, isDatePrivate, isEventPrivate, name, ownerId, place_id, time } = doc.data();
            let dt = DateTime.fromISO(`${date}T${time}`);
            return { 'name':name, 'address':address, 'place_id': place_id, 'formatted_date':dt.toLocaleString(DateTime.DATETIME_SHORT),
                'date':date, 'time':time, 'private_date':isDatePrivate, 'private_event': isEventPrivate, 
                'owner_id':ownerId, 'id':doc.id };
        });
        if(eventList.value.legnth === 0){
            noEvents.value = true;
        }
    } catch(e) {
        console.dir(e);
        noEvents.value = true;
    }
});

</script>

<template>
    <header>
        <MainNavigation></MainNavigation>
    </header>
    <div v-bind:class="{ 'modal':true, 'is-active':displayEventForm }">
        <div class="modal-background"></div>
        <div class="modal-content">
            <EventForm v-bind:user-id="userId"></EventForm>
        </div>
        <button class="modal-close is-large" aria-label="close" v-on:click="displayEventForm = false"></button>
    </div>
    <section class="mb-6">
        <div class="container is-max-desktop">
            <div class="columns is-multiline">
                <div v-if="!displayEventForm" class="column is-12">
                    <a button class="button is-primary" v-on:click="displayEventForm = true">New Event</a>
                </div>
                <div v-if="noEvents" class="column is-12">
                    <div class="notification is-link">
                        <span class="title">There are no events.</span>
                    </div>
                </div>
                <div v-for="event in eventList" v-bind:key="event.id" class="column is-4">
                    <div class="card">
                        <div class="card-image">
                            <figure class="image is-4by3">
                                <img v-bind:src="mapApiUri + '&size=400x300' + '&center=' + encodeURIComponent(event.address)" v-bind:alt="event.name"/>
                            </figure>
                        </div>
                        <div class="card-content">
                            <p class="is-size-3 has-text-weight-semibold">{{ event.name }}</p>
                        </div>
                        <div class="card-footer">
                            <div class="card-footer-item field has-addons">
                                    <div class="control">
                                        <button class="button is-success">Edit</button>
                                    </div>
                                    <div class="control">
                                        <button class="button is-danger">Delete</button>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <footer class="footer">
        
    </footer>
</template>