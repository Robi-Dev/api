import { Request, Response } from 'express'
import {
   createCategory,
   getCategoryById,
   getAllCategories,
   getAllPublicCategories,
   updateCategory,
   deleteCategory,
   getFilterCategories,
   getCategoryBySlug,
   getBestDealFilter,
   updateCategoryStatus,
   getCategoryBySlugPrivet,
} from '../service/category.service'

// create a category contrller function
export async function createCategoryHandler(req: Request, res: Response) {
   // get the preview image
   const previewImg = req.file?.path
   try {
      const category = await createCategory(req.body, previewImg)
      res.status(201).json({
         message: 'Successfully created category',
         data: category,
      })
   } catch (e: any) {
      res.status(500).json({
         message: 'Internal server error',
         error: e.message,
      })
   }
}

// get a category by id controller function
export async function getCategoryByIdHandler(req: Request, res: Response) {
   try {
      const category = await getCategoryById(req.params.id)
      res.status(200).json({
         message: 'Successfully fetched category',
         data: category,
      })
   } catch (e: any) {
      res.status(500).json({
         message: 'Internal server error',
         error: e.message,
      })
   }
}

// get all categories private controller function
export async function getAllCategoriesHandler(req: Request, res: Response) {
   const { type } = req.params
   try {
      const categories = await getAllCategories(type)
      res.status(200).json({
         message: 'Successfully fetched categories',
         data: categories,
      })
   } catch (e: any) {
      res.status(500).json({
         message: 'Internal server error',
         error: e.message,
      })
   }
}

// get all categories public controller function
export async function getAllPublicCategoriesHandler(
   req: Request,
   res: Response,
) {
   const { type } = req.params
   try {
      const categories = await getAllPublicCategories(type)
      res.status(200).json({
         message: 'Successfully fetched categories',
         data: categories,
      })
   } catch (e: any) {
      res.status(500).json({
         message: 'Internal server error',
         error: e.message,
      })
   }
}

// get all search public category controller function
export async function getBestDealsFilterHandler(req: Request, res: Response) {
   // get the  Exclusive, New, Featured from query url
   const { status, type } = req.query

   try {
      const categories = await getBestDealFilter(status, type)
      res.status(200).json({
         message: 'Successfully fetched categories',
         data: categories,
      })
   } catch (e: any) {
      res.status(500).json({
         message: 'Internal server error',
         error: e.message,
      })
   }
}

// get filter categories public
export async function getFilterCategoriesHandler(req: Request, res: Response) {
   const slug = req.params.slug
   const type = req.params?.type
   try {
      const categories = await getFilterCategories(slug, type)
      res.status(200).json({
         message: 'Successfully fetched categories',
         data: categories,
      })
   } catch (e: any) {
      res.status(500).json({
         message: 'Internal server error',
         error: e.message,
      })
   }
}

// find category by slug privet function
export async function getCategoryBySlugPrivetHandler(
   req: Request,
   res: Response,
) {
   const { theme, slug, type } = req.params
   try {
      const category = await getCategoryBySlugPrivet(theme, slug, type)
      res.status(200).json({
         message: 'Successfully fetched category',
         data: category,
      })
   } catch (e: any) {
      res.status(500).json({
         message: 'Internal server error',
         error: e.message,
      })
   }
}

// find category by slug public function
export async function getCategoryBySlugHandler(req: Request, res: Response) {
   const { theme, slug, type } = req.params
   try {
      const category = await getCategoryBySlug(theme, slug, type)
      res.status(200).json({
         message: 'Successfully fetched category',
         data: category,
      })
   } catch (e: any) {
      res.status(500).json({
         message: 'Internal server error',
         error: e.message,
      })
   }
}

// update category controller function
export async function updateCategoryHandler(req: Request, res: Response) {
   // get the preview image
   const previewImg = req.file?.path

   try {
      const category = await updateCategory(req.params.id, previewImg, req.body)
      res.status(200).json({
         message: 'Successfully updated category',
         data: category,
      })
   } catch (e: any) {
      res.status(500).json({
         message: 'Internal server error',
         error: e.message,
      })
   }
}

// status update category controller function
export async function updateCategoryStatusHandler(req: Request, res: Response) {
   const categoryId = req.params.categoryId
   const status = req.params.status
   try {
      const category = await updateCategoryStatus(categoryId, status)
      res.status(200).json({
         message: 'Successfully updated category',
         data: category,
      })
   } catch (e: any) {
      res.status(500).json({
         message: 'Internal server error',
         error: e.message,
      })
   }
}

// delete category controller function
export async function deleteCategoryHandler(req: Request, res: Response) {
   try {
      const category = await deleteCategory(req.params.id)
      res.status(200).json({
         message: 'Successfully deleted category',
         data: category,
      })
   } catch (e: any) {
      res.status(500).json({
         message: 'Internal server error',
         error: e.message,
      })
   }
}
