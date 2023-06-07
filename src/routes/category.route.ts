import { Express } from 'express'

import {
   createCategoryHandler,
   getCategoryByIdHandler,
   getAllCategoriesHandler,
   getAllPublicCategoriesHandler,
   updateCategoryHandler,
   deleteCategoryHandler,
   getFilterCategoriesHandler,
   getCategoryBySlugHandler,
   getBestDealsFilterHandler,
   updateCategoryStatusHandler,
   getCategoryBySlugPrivetHandler,
} from '../controller/category.controller'
import { isLoggedIn } from '../middleware/auth.passport'
import {
   validateCategory,
   validateCategorySearch,
} from '../middleware/category.validate'
import upload from '../utils/multer'

// create category route function
function categoryRoute(app: Express) {
   // create a category
   app.post(
      '/api/v1/category',
      isLoggedIn,
      upload.single('image'),
      validateCategory,
      createCategoryHandler,
   )

   // get a category by id
   app.get('/api/v1/category/:id', isLoggedIn, getCategoryByIdHandler)

   // get all categories private
   app.get('/api/v1/categories/:type', isLoggedIn, getAllCategoriesHandler)

   // get all categories public
   app.get('/api/v1/categories/public/:type', getAllPublicCategoriesHandler)

   // get best deal based query parameters
   app.get('/api/v1/bestdeals/categories', getBestDealsFilterHandler)

   // filter category route public
   app.get('/api/v1/categories/filter/:slug/:type', getFilterCategoriesHandler)

   // find category by slug private
   app.get(
      '/api/v1/categories/private/:theme/:slug/:type',
      isLoggedIn,
      getCategoryBySlugPrivetHandler,
   )

   // find category by slug public
   app.get('/api/v1/categories/:theme/:slug/:type', getCategoryBySlugHandler)

   // update category
   app.put(
      '/api/v1/category/:id',
      isLoggedIn,
      upload.single('image'),
      validateCategory,
      updateCategoryHandler,
   )

   // update category status
   app.patch(
      '/api/v1/category/:categoryId/:status',
      isLoggedIn,
      updateCategoryStatusHandler,
   )

   // delete category
   app.delete('/api/v1/category/:id', isLoggedIn, deleteCategoryHandler)
}

export default categoryRoute
