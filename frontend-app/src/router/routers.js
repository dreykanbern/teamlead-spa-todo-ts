import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage/HomePage.vue';
import EditTaskPage from '../views/EditTaskPage/EditTaskPage.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage,
    },
    {
        path: '/edit/:id',
        name: 'EditTask',
        component: EditTaskPage,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;