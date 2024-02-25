<script setup>
import { useCurrentUser, useFirebaseAuth} from 'vuefire';
import MainNavigation from '@/components/MainNavigation.vue';

//composables
const user = useCurrentUser();
const auth = useFirebaseAuth();

</script>

<template>
    <header>
        <MainNavigation></MainNavigation>
    </header>
    <section>
        <div class="container is-max-desktop">
            
        </div>
    </section>
    <footer class="footer">
        
    </footer>
</template>