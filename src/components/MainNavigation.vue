<script setup>
    import { RouterLink } from 'vue-router';
</script>

<template>
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <span class="navlogo"><a href="/" class="navbar-item">IATGD</a></span>
        </div>

        <div class="navbar-end">
            <div class="navbar-item">
                <a class="button is-dark">Log Out</a>
            </div>
        </div>
    </nav>
</template>

<style scoped>
.navlogo {
    font-size: 3rem;
    font-weight: 800;
    line-height: 3.2rem;
}
</style>