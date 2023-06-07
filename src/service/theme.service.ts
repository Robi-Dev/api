import ThemeModel from '../models/theme.model'

// create a theme services
export async function createTheme(input: any) {
   try {
      return await ThemeModel.create(input)
   } catch (e: any) {
      throw new Error(e)
   }
}

// get a theme by id services
export async function getThemeById(id: string) {
   try {
      return await ThemeModel.findById(id)
   } catch (e: any) {
      throw new Error(e)
   }
}

// get all themes private services
export async function getAllThemes(type: string) {
   try {
      return await ThemeModel.find({
         type: type,
      })
   } catch (e: any) {
      throw new Error(e)
   }
}

// get all themes public services
export async function getAllPublicThemes(type: string) {
   const data = await ThemeModel.aggregate([
      {
         $match: {
            'status.isPublished': true,
         },
      },
   ])
   try {
      // aggreate the total theme, total category and total section
      return await ThemeModel.aggregate([
         {
            $match: {
               'status.isPublished': true,
               type: type,
            },
         },

         {
            $lookup: {
               from: 'categories',
               let: { themeId: '$_id' },
               pipeline: [
                  {
                     $match: { $expr: { $eq: ['$theme', '$$themeId'] } },
                  },
               ],

               as: 'categories',
            },
         },
         // count the total section of each category

         {
            $lookup: {
               from: 'sections',
               let: { category: '$_id' },
               pipeline: [
                  {
                     $match: { $expr: { $eq: ['$theme', '$$category'] } },
                  },
               ],
               as: 'sections',
            },
         },

         {
            $project: {
               _id: 1,
               name: 1,
               slug: 1,
               image: 1,
               type: 1,
               categories: {
                  name: 1,
                  slug: 1,
                  image: 1,
               },
               totalSections: { $size: '$sections' },
            },
         },
      ])
   } catch (e: any) {
      throw new Error(e)
   }
}

// update theme services
export async function updateTheme(id: string, input: any) {
   try {
      return await ThemeModel.findByIdAndUpdate(id, input, { new: true })
   } catch (e: any) {
      throw new Error(e)
   }
}

// update theme status by id
export async function updateThemeStatus(id: string, status: any) {
   switch (status) {
      case 'publish':
         status = {
            'status.isPublished': true,
         }
         break
      case 'disable':
         status = {
            'status.isPublished': false,
         }
         break
      case 'private':
         status = {
            'status.isPrivate': true,
         }
         break
      case 'public':
         status = {
            'status.isPrivate': false,
         }
         break
      case 'active':
         status = {
            'status.isActive': true,
         }
         break
      case 'inactive':
         status = {
            'status.isActive': false,
         }
         break
      default:
         // status not found return error
         throw new Error('status not found')
   }
   try {
      return await ThemeModel.findByIdAndUpdate(id, status, {
         new: true,
         lean: true,
      })
   } catch (e: any) {
      throw new Error(e)
   }
}

// delete theme services
export async function deleteTheme(id: string) {
   try {
      return await ThemeModel.findByIdAndDelete(id)
   } catch (e: any) {
      throw new Error(e)
   }
}
