<script setup>
import { computed, ref } from 'vue';
import { DateTime } from 'luxon';
import axios from 'axios';

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
const GEOCODING_KEY = 'AIzaSyCKP5fYA_yjsuNxZzEZOZsDMw20JSrOvys';

/**
 * computed properties
 */
const has_address_list = computed(()=> {
    return !!address_list.value && address_list.value.length > 0;
});

/**
 * component properties for dislpay and functionality
 */
//object to hold the event data to be saved
const eventInfo = ref( { 
    name: '', 
    address: '',
    date: DateTime.now().toFormat('yyyy-MM-dd'),
    time: DateTime.now().toFormat('T'), 
    ownerId: props.userId, 
    isEventPrivate: false, 
    isLocationPublic: true, 
    isDatePublic: true 
} );
//the step to display in the 'New Event Form'
const selectedFormStage = ref('step1');
//Geocode search address list
const address_list = ref([]);

/**
 * General functions used to provide app functionality 
 */

/**
 * fucntion used to get the value of the 'Is Private event' checkbox and save it to the object used to store event info
 * @param {HtmlNode} element 
 */
function setIsEvent(element){
    console.log('Element checked value: %s',JSON.stringify(element,null,"\t"));
    eventInfo.value.isEventPrivate = element.value;
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
        let tempAddressArray = lookupResponse.data.results.map( addrInfo => {
            return { address: addrInfo.formatted_address, location:addrInfo.geometry.location, place_id : addrInfo.place_id };
        });
        address_list.value = tempAddressArray;
    } catch(e) {
        console.log('There was an error:');
        console.dir(e);
    }
}
function resetLookup(){
    address_list.value = [];
    eventInfo.value.address = '';
}
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
                        <input type="checkbox" v-bind:checked="eventInfo.isEventPrivate" v-on:change="setIsEvent($event)"/>
                        This Event Is Private
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
                        <select>
                            <option v-for="addr in address_list" v-bind:key="addr.place_id" value="addr.address">{{ addr.address }}</option>
                        </select>
                    </div>
                </div>
                <div class="control">
                    <a class="button is-info" v-on:click="lookupAddress">Lookup</a>
                </div>
                <div class="control">
                    <a class="button is-danger" v-on:click="resetLookup">Reset</a>
                </div>
            </div>
            <div class="field is-grouped">
                <a class="button is-warning mr-2" v-on:click="selectedFormStage = 'step1'">Back</a>
                <a class="button is-link" v-on:click="selectedFormStage = 'step3'">Next</a>
            </div>
        </div>
        <!--END: Step 2 Form Fields-->
    </div>
</template>