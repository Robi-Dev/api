import { Express } from 'express';
import upload from '../utils/multer';
import {
  createSectionHandler,
  getSectionHandler,
  findSectionHandler,
  updateSectionHandler,
  getSectionByIdHandler,
  deleteSectionHandler,
  updateSectionStatusHandler,
} from '../controller/section.controller';
import { isLoggedIn } from '../middleware/auth.passport';
import { validateSectionRequest } from '../middleware/section.validation';
import { isAdmin } from '../middleware/auth.user';

function sectionRoute(app: Express) {
  // create a section
  app.post(
    '/api/v1/section',
    upload.single('previewImg'),
    isLoggedIn,
    validateSectionRequest,
    createSectionHandler,
  );

  // get a section details by id private
  app.get(
    '/api/v1/section/sectiondetails/:sectionId',
    isLoggedIn,
    getSectionHandler,
  );

  // get section by section Id
  app.get('/api/v1/section/codes/:sectionId', isLoggedIn, getSectionByIdHandler);

  // find all section private
  app.get('/api/v1/sections', isLoggedIn, isAdmin, findSectionHandler);

  // // find all public section
  // app.get("/api/v1/sections/public", findSectionPublicHandler);

  // update section componentsx
  app.put(
    '/api/v1/section/:sectionId',
    upload.single('previewImg'),
    isLoggedIn,
    updateSectionHandler,
  );

  // patch the status
  app.patch(
    '/api/v1/section/:sectionId/:status',
    isLoggedIn,
    updateSectionStatusHandler,
  );

  // delete a section by ID
  app.delete('/api/v1/section/:sectionId', isLoggedIn, deleteSectionHandler);
}

export default sectionRoute;

function UpdateSectionStatusHandler(
  arg0: string,
  isLoggedIn: any,
  UpdateSectionStatusHandler: any,
) {
  throw new Error('Function not implemented.');
}
