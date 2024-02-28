<script setup>
import { ref } from 'vue';
import { DateTime } from 'luxon';

const props = defineProps( {
    userId: {
        type: String,
        default: (()=>{
            return ''
        })
    }
} );

//component properties
const eventInfo = ref( { 
    name: '', 
    date: DateTime.now().toString(), 
    ownerId: props.userId, 
    isEventPrivate: false, 
    isLocationPublic: true, 
    isDatePublic: true 
} );

</script>

<template>
    <div class="box">
        <h2 class="is-size-1 is-uppercase has-text-weight-bold">New Event</h2>

        <div class="field">
            <label class="label" for="eventname">Event Name</label>
            <div class="control">
                <input class="input" name="eventname" v-model="eventInfo.name" type="text" placeholder="My Lit Party!"/>
            </div>
        </div>
        <!--
        <div class="field">
            <label class="label" for="eventdate">Event Date</label>
            <div class="control">
                <input class="input" name="eventdate" v-model="eventInfo.date" type="datetime-local" placeholder="Event Date"/>
            </div>
        </div>

        <div class="field">
            <label class="checkbox">
                <input type="checkbox" v-model="eventInfo.isEventPrivate"/>
                This Event Is Private
            </label>
        </div>
        -->
    </div>
</template>