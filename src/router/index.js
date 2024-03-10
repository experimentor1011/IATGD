import { createRouter, createWebHistory } from 'vue-router'
import { getCurrentUser } from 'vuefire';
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue';
import MainView from '../views/MainView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {requiresAuth: false }
    },
    {
      path: '/app',
      name: 'main',
      component: MainView,
      meta: { requiresAuth: true }
    }
  ]
});

//setup navigation guards
router.beforeEach(async ( to, _ ) => {
  if(to.meta.requiresAuth){
    var currentUser;
    try {
      currentUser = await getCurrentUser();
    } catch(e) {
      console.log('THere was an error getting the current user');
    }
    if(!currentUser){
      return { name:'login', query: { redirect: to.fullPath } };
    }
  }
});

export default router
