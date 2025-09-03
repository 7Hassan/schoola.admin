import express, { Router } from 'express';
import docsRoute from './swagger.route';
import userRoute from './user.route';
import studentRoute from './student.route';
import teacherRoute from './teacher.route';
import courseRoute from './course.route';
import authorityRoute from './authority.route';
import parentRoute from './parent.route';
import systemRoute from './system.route';
import config from '../../config/config';

const router = express.Router();

interface IRoute {
  path: string;
  route: Router;
}

const defaultIRoute: IRoute[] = [
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/students',
    route: studentRoute,
  },
  {
    path: '/teachers',
    route: teacherRoute,
  },
  {
    path: '/courses',
    route: courseRoute,
  },
  {
    path: '/authorities',
    route: authorityRoute,
  },
  {
    path: '/parents',
    route: parentRoute,
  },
  {
    path: '/system',
    route: systemRoute,
  },
];

const devIRoute: IRoute[] = [
  // IRoute available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devIRoute.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
