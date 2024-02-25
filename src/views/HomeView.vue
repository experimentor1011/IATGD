<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <header>

  </header>

  <section>
    <div class="container is-max-desktop">
      <h2 class="is-size-2 is-uppercase has-text-wieght-bold">You Can Take Your Party With You!</h2>
      <div class="content">
        Keep the party lit with the number one app designed for pop-up parties! Keep your party exclusive by setting a 
        specific time to share your details and location to your invitees! Once your Pary start, enable "follow me" mode 
        to share your location with ALL your party people so the party can follow you where-ever you go!  Ready to end the party?
        Send the announcement to all of your invitees.
      </div>
    </div>
  </section>

  <section>
    <div class="container is-max-desktop">
      <h2 class="is-size-2 is-uppercase has-text-wieght-bold">Create and Manage Your Pop-Up Party!</h2>
      <div class="content">
        <h3>Step 1 - Create Account</h3>
        <p>Create your Account or Login <router-link to="login">here</router-link>.</p>
        <h3>Step 2 - Create Pop-Party Event</h3>
        <p>
          Give us your party details - the where, the when and the what! You also can choose to be ultra-mysterious and hide these
          these details - even from your invitees, until a specified time.
        </p>
        <h3>Step 3 - Invite Others</h3>
        <p>
          Invite others via text, email, or social media. You can keep the event exclusive by only allowing certain people to
          see the details, or you can allow anyone to see! You can even set up RSVP links!
        </p>
        <h3>Step 4 - Party!</h3>
        <p>
          Party On!  Is your party constantly moving? Send an instant notification to all party attendees through the app
          with the new location while its still going on!
        </p>
      </div>
    </div>
  </section>
  
  <footer class="footer">
    <div class="content has-text-centered">
      Site and Application still in Beta. Please report all errors to <a href="mailto:me@cgary.com">Site Owner</a>.
    </div>
  </footer>
</template>
