<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import { DateTime } from 'luxon';
import axios from 'axios';
import { useFirestore } from 'vuefire';
import { collection, addDoc } from '@firebase/firestore';


//external component properties
const props = defineProps( {
    userId: {
        type: String,
        default: (()=>{
            return ''
        })
    }
} );

/**
 * Constants
 */
//Google URL used for Geocoding Address typed in
const GEOCODING_URL = 'https://maps.googleapis.com';
//Google API Key used for Geocoding and Places API
const GEOCODING_KEY = import.meta.env.VITE_GOOGLE_APIKEY;
const firestoreApp = useFirestore();
const eventCollection = collection(firestoreApp,'events');


/**
 * computed properties
 */
const has_address_list = computed(()=> {
    return !!address_list.value && address_list.value.length > 0;
});
const has_err_mess = computed(() => {
    return !!err_mess.value && err_mess.value.length > 0;
});

/**
 * component properties for dislpay and functionality
 */
//object to hold the event data to be saved
const eventInfo = ref( { 
    name: '', 
    address: '',
    place_id: '',
    date: DateTime.now().toFormat('yyyy-MM-dd'),
    time: DateTime.now().toFormat('T'), 
    ownerId: props.userId, 
    isEventPrivate: false, 
    isLocationPrivate: true, 
    isDatePrivate: true 
} );
//the step Metropolisto display in the 'New Event Form'
const selectedFormStage = ref('step1');
//Geocode search address list
const address_list = ref([]);
const err_mess = ref('');
const geoMapCenter = ref({lat:0.0,lng:0.0});
const geoMapZoom = ref(15);
/**
 * General functions used to provide app functionality 
 */

function logEventData(evt){
    console.log('Log Event Data.');
    console.dir(evt);
}

/**
 * fucntion used to get the value of the 'Is Private event' checkbox and save it to the object used to store event info
 * @param {HtmlNode} element 
 */
function setEventVisibility(evt){
    eventInfo.value.isEventPrivate = evt.target.checked;
}
function setDateVisibility(evt){
    eventInfo.value.isDatePrivate = evt.target.checked;
}
function setLocationVisibility(evt){
    eventInfo.value.isLocationPrivate = evt.target.checked;
}
/**
 * function used to lookup the address and provide back a list of geocoding addresses that match.
 */
async function lookupAddress(){
    let requestConfig = {
        url: '/maps/api/geocode/json',
        method:'get',
        baseURL: GEOCODING_URL,
        params: {
            address: eventInfo.value.address,
            key: GEOCODING_KEY
        }
    };
    try {
        let lookupResponse = await axios(requestConfig);
        console.dir(lookupResponse.data);
        if(lookupResponse.data.status === 'ZERO_RESULTS') {
            err_mess.value = 'could not find this address. Please try again.';
        }
        let tempAddressArray = lookupResponse.data.results.map( addrInfo => {
            return { address: addrInfo.formatted_address, location:addrInfo.geometry.location, place_id : addrInfo.place_id,
                coords: addrInfo.geometry.location };
        });
        address_list.value = tempAddressArray;
        //auto-assign the first address coming back
        if(has_address_list.value){
            eventInfo.value.address = address_list.value[0].address
            eventInfo.value.place_id = address_list.value[0].place_id;
            geoMapCenter.value = address_list.value[0].coords;
        }
        
    } catch(e) {
        console.log('There was an error:');
        console.dir(e);
    }
}
function handleLocationSelection(event){
    console.dir(event.target.selectedOptions[0].value);
}
function resetLookup(){
    address_list.value = [];
    eventInfo.value.address = '';
    err_mess.value = '';
}
async function createEvent(){
    try {
        let result = await addDoc(eventCollection,eventInfo.value);
        console.log('Data Write Result');
        logEventData(result);
    } catch(e) {
        logEventData(e);
    }
}
/**
 * Lifecycle Methods
 */
onBeforeMount(()=>{
    navigator.geolocation.getCurrentPosition((position)=>{
        let coords = {lat:position.coords.latitude,lng:position.coords.longitude};
        geoMapCenter.value = coords;
    });
})
</script>

<template>
    <div class="box">
        <h2 class="is-size-1 is-uppercase has-text-weight-bold">New Event</h2>
        <!--BEGIN: Step 1 Form Fields-->
        <div v-if="selectedFormStage === 'step1'">
            <div class="field">
                <label class="label" for="eventname">Event Name</label>
                <div class="control">
                    <input class="input" name="eventname" v-model="eventInfo.name" type="text" placeholder="My Lit Party!"/>
                </div>
            </div>
            <div class="field">
                <label class="label" for="eventdate">Event Date</label>
                <div class="control">
                    <input class="input" name="eventdate" type="date" v-model="eventInfo.date" placeholder="Event Date"/>
                </div>
            </div>
            <div class="field">
                <label class="label" for="eventtime">Event Time</label>
                <div class="control">
                    <input class="input" type="time" v-model="eventInfo.time" name="eventtime"/>
                </div>
            </div>
            <div class="field">
                <label class="checkbox">
                    <div class="control">
                        <input type="checkbox" v-bind:checked="eventInfo.isEventPrivate" v-on:change="setEventVisibility($event)"/>
                        This Event Is Private
                    </div>
                </label>
            </div>
            <div class="field">
                <label class="checkbox">
                    <div class="control">
                        <input type="checkbox" v-bind:checked="eventInfo.isDatePrivate" v-on:change="setDateVisibility($event)"/>
                        Hide Date Until Last Minute
                    </div>
                </label>
            </div>
            <div class="field is-grouped">
                <a class="button is-link" v-on:click="selectedFormStage = 'step2'">Next</a>
            </div>
        </div>
        <!--END: Step 1 Form Fields-->

        <!--BEGIN: Step 2 Form Fields-->
        <div v-if="selectedFormStage === 'step2'">
            <div class="field has-addons">
                <div class="control">
                    <input v-if="!has_address_list" class="input" type="text" name="eventaddress" v-model="eventInfo.address" placeholder="Enter Address"/>
                    <div v-if="has_address_list" class="select">
                        <select v-on:change="handleLocationSelection">
                            <option v-for="addr in address_list" v-bind:key="addr.place_id" v-bind:value="addr.place_id">{{ addr.address }}</option>
                        </select>
                    </div>
                    <p v-if="has_err_mess" class="help is-danger">{{ err_mess }}</p>
                </div>
                <div class="control">
                    <a class="button is-info" v-on:click="lookupAddress">Lookup</a>
                </div>
                <div class="control">
                    <a class="button is-danger" v-on:click="resetLookup">Reset</a>
                </div>
            </div>
            <GMapMap map-type-id="roadmap" v-bind:zoom="geoMapZoom" v-bind:center="geoMapCenter" style="width:100%; height:30vh;">
                <GMapMarker v-bind:position="geoMapCenter"></GMapMarker>
            </GMapMap>
            <div class="field">
                <label class="control">
                    <input type="checkbox" v-bind:checked="eventInfo.isLocationPrivate" v-on:change="setLocationVisibility($event)"/>
                    Hide the Location until event time 
                </label>
            </div>
            <div class="field is-grouped">
                <a class="button is-warning mr-2" v-on:click="selectedFormStage = 'step1'">Back</a>
                <a class="button is-link" v-on:click="createEvent">Create Event</a>
            </div>
        </div>
        <!--END: Step 2 Form Fields-->

        <!--BEGIN: Step 3 Form Fields-->
        <div v-if="selectedFormStage === 'step3'">
        </div>
        <!--END: Step 3 Form Fields-->
    </div>
</template>