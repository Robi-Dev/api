// template route
import { Express } from 'express'
import {
   createTemplateHandler,
   deleteTemplateHandler,
   getAllPublicTemplatesHandler,
   getAllTemplatesHandler,
   getTemplateByIdHandler,
   getTemplateBySlugHandler,
   getTemplateDetailsByIdHandler,
   updateTemplateHandler,
   updateTemplateStatusHandler,
} from '../controller/template.controller'
import { isLoggedIn } from '../middleware/auth.passport'
import { validationTemplate } from '../middleware/template.validation'
import upload from '../utils/multer'

function templateRouter(app: Express) {
   // create a template
   app.post(
      '/api/v1/template',
      upload.single('previewImg'),
      isLoggedIn,
      validationTemplate,
      createTemplateHandler,
   )

   //get a template by slug
   app.get('/api/v1/template/:id', getTemplateBySlugHandler)

   // get template codes by id private
   app.get('/api/v1/template/codes/:id', isLoggedIn, getTemplateByIdHandler)

   // get template details by id private
   app.get(
      '/api/v1/template/details/:id',
      isLoggedIn,
      getTemplateDetailsByIdHandler,
   )

   //get all templates private
   app.get('/api/v1/templates', isLoggedIn, getAllTemplatesHandler)

   // get all templates public
   app.get('/api/v1/templates/public', getAllPublicTemplatesHandler)

   // update template
   app.put(
      '/api/v1/template/:id',
      isLoggedIn,
      upload.single('previewImg'),
      validationTemplate,
      updateTemplateHandler,
   )

   // patch the status
   app.patch(
      '/api/v1/template/:templateId/:status',
      isLoggedIn,
      updateTemplateStatusHandler,
   )

   // delete template
   app.delete('/api/v1/template/:templateId', isLoggedIn, deleteTemplateHandler)
}

export default templateRouter
