import { Express } from 'express';
import {
  createThemeHandler,
  getThemeByIdHandler,
  getAllThemesHandler,
  getAllPublicThemesHandler,
  updateThemeHandler,
  deleteThemeHandler,
  updateThemeStatusHandler,
} from '../controller/theme.controller';
import { isLoggedIn } from '../middleware/auth.passport';
import { validateTheme } from '../middleware/theme.validate';

export function themeRoute(app: Express) {
  // create a theme
  app.post('/api/v1/theme', validateTheme, isLoggedIn, createThemeHandler);

  //get a theme by id
  app.get('/api/v1/theme/:id', isLoggedIn, getThemeByIdHandler);

  //get all themes private
  app.get('/api/v1/themes/:type', isLoggedIn, getAllThemesHandler);

  // get all theme public
  app.get('/api/v1/themes/public/:type', getAllPublicThemesHandler);

  // update theme
  app.put('/api/v1/theme/:id', validateTheme, isLoggedIn, updateThemeHandler);

  // patch the status
  app.patch(
    '/api/v1/theme/:themeId/:status',
    isLoggedIn,
    updateThemeStatusHandler,
  );

  // delete theme
  app.delete('/api/v1/theme/:id', isLoggedIn, deleteThemeHandler);
}

export default themeRoute;
