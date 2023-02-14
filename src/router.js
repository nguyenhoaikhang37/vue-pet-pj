import { createWebHistory, createRouter } from 'vue-router';
import store from './store/index';

const CoachesList = () => import('./pages/coaches/CoachesList.vue');

const CoachesDetail = () => import('./pages/coaches/CoachesDetail.vue');

const CoachesRegistration = () =>
  import('./pages/coaches/CoachesRegistration.vue');

const ContactCoach = () => import('./pages/requests/ContactCoach.vue');

const RequestsReceived = () => import('./pages/requests/RequestsReceived.vue');

const UserAuth = () => import('./pages/auth/UserAuth.vue');

const NotFound = () => import('./pages/NotFound.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/coaches',
    },
    {
      path: '/coaches',
      component: CoachesList,
    },
    {
      path: '/coaches/:id',
      component: CoachesDetail,
      props: true,
      children: [
        {
          path: 'contact',
          component: ContactCoach,
        },
      ],
    },
    {
      path: '/register',
      component: CoachesRegistration,
      meta: {
        requiresAuth: true, // bảo vệ điều hướng
      },
    },
    {
      path: '/requests',
      component: RequestsReceived,
      meta: {
        requiresAuth: true, // bảo vệ điều hướng
      },
    },
    {
      path: '/auth',
      component: UserAuth,
      meta: {
        requiresUnAuth: true, // bảo vệ điều hướng
      },
    },
    {
      path: '/:notFound(.*)',
      component: NotFound,
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    next('/auth');
  } else if (to.meta.requiresUnAuth && store.getters.isAuthenticated) {
    next(from);
  } else {
    next();
  }
});

export default router;
