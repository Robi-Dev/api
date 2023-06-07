import { Express } from 'express';
import {
  createCollectionHandler,
  deleteCollectionHandler,
  findCollectionsByTypeHandler,
} from '../controller/collection.controller';
import { isLoggedIn } from '../middleware/auth.passport';
import {
  deleteCollectionValidation,
  isExistsCollection,
  validationCollection,
  validationGetCollections,
} from '../middleware/collection.validation';

const collectionRoute = (app: Express) => {
  // create a collection
  app.post(
    '/api/v1/collection',
    isLoggedIn,
    validationCollection,
    isExistsCollection,
    createCollectionHandler,
  );

  // find all collection private
  app.get(
    '/api/v1/collections/:type',
    isLoggedIn,
    validationGetCollections,
    findCollectionsByTypeHandler,
  );

  //   delete a collection by ID
  app.delete(
    '/api/v1/collection/:id',
    isLoggedIn,
    deleteCollectionValidation,
    deleteCollectionHandler,
  );
};

export default collectionRoute;
