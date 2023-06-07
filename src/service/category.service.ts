import CategoryModel, { CategoryDocument } from '../models/category.model';
import SectionModel from '../models/section.model';
import TemplateModel from '../models/template.model';
import ThemeModel from '../models/theme.model';
import cloudinary from '../utils/cloudinary';

// create category services function
export async function createCategory(input: CategoryDocument, previewImg: any) {
  let categoryInput;
  if (previewImg) {
    //  upload to cludinary
    const previewImgData = await cloudinary.uploader.upload(previewImg);

    categoryInput = {
      ...input,
      image: previewImgData.secure_url,
      // image id from cloudinary
      imageId: previewImgData.public_id,
    };
  } else {
    categoryInput = {
      ...input,
    };
  }
  try {
    return await CategoryModel.create(categoryInput);
  } catch (e: any) {
    throw new Error(e.message);
  }
}

// get a category by id services function
export async function getCategoryById(id: string) {
  try {
    return await CategoryModel.findById(id);
  } catch (e: any) {
    throw new Error(e.message);
  }
}

// get all categories private services function
export async function getAllCategories(type: string) {
  try {
    return await CategoryModel.find(
      {
        type: type,
      },

      // do not show the following fields
      {
        _id: 1,
        name: 1,
        status: 1,
        slug: 1,

        image: 1,
      },
    ).populate('theme', { name: 1, slug: 1 });
  } catch (e: any) {
    throw new Error(e.message);
  }
}

// get all categories public services function
export async function getAllPublicCategories(type: string) {
  try {
    return await CategoryModel.find({
      type: type,
      'status.isPublished': true,
      'status.isApproved': true,
    });
  } catch (e: any) {
    throw new Error(e.message);
  }
}

// search category by status public services function
export async function getBestDealFilter(query: any, type: any) {
  const name =
      query === 'exclusive'
        ? 'status.isExclusive'
        : query === 'new'
          ? 'status.isNew'
          : query === 'featured'
            ? 'status.isFeatured'
            : '';
  const value =
      query === 'exclusive'
        ? true
        : query === 'new'
          ? true
          : query === 'featured' && true;

  try {
    return await CategoryModel.aggregate([
      {
        $match: {
          'status.isPublished': true,
          'status.isApproved': true,
          type: type,
          // if isExclusive is true then find the data isExclusive is true
          // if isNew is true then find the data isNew is true
          // if isFeatured is true then find the data isFeatured is true
          $or: [{ [name]: value }],
        },
      },
      // count the sectiosn under each catgeory
      {
        $lookup: {
          from: 'sections',
          let: { categoryId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$category', '$$categoryId'] },
              },
            },
          ],
          as: 'sections',
        },
      },
      // project
      {
        $project: {
          _id: 1,

          name: 1,
          slug: 1,
          description: 1,
          image: 1,
          status: 1,
          totalSections: { $size: '$sections' },
        },
      },
    ]);
  } catch (e: any) {
    throw new Error(e.message);
  }
}

// get filter category service
export async function getFilterCategories(slug: string, type: string) {
  // find theme based on slug
  const themeName = await ThemeModel.findOne({ slug, type });
  const name = themeName?.name
    ? themeName?.name
    : type === 'templates'
      ? 'All Pages'
      : 'All Components';
  // get all themes
  const themes = await ThemeModel.find(
    {
      'status.isPublished': true,
      type: type,
    },

    { name: 1, slug: 1, _id: 1, type: 1 },
  );
  const info = {
    name,
    slug: themeName?.slug,
    description: themeName?.description,
  };

  // get all category and total count of section at each category
  const categoriesData = await CategoryModel.aggregate([
    {
      $match: {
        'status.isPublished': true,
        'status.isApproved': true,
        type: type,
        $or: [
          { theme: themeName?._id },
          { theme: slug === 'allthemes' ? { $ne: { theme: null } } : null },
        ],
      },
    },
    {
      $lookup: {
        from: 'sections',
        let: { categoryId: '$_id' },
        pipeline: [
          {
            $match: { $expr: { $eq: ['$category', '$$categoryId'] } },
          },
        ],
        as: 'countSections',
      },
    },

    {
      $project: {
        _id: 1,
        name: 1,
        slug: 1,
        image: 1,
        status: {
          isPublished: 1,
          isApproved: 1,
          isCollection: 1,
          isNew: 1,
          isFeatured: 1,
          isExclusive: 1,
        },
        theme: 1,
        totalSection: {
          $size: {
            $filter: {
              input: '$countSections',
              as: 'section',
              cond: {
                $and: [
                  { $eq: ['$$section.status.isPublished', true] },
                  { $eq: ['$$section.status.isApproved', true] },
                ],
              },
            },
          },
        },
      },
      // add totalSections
    },
  ]);
  // get all category and total count of template at each category
  const categoriesDataTemplate = await CategoryModel.aggregate([
    {
      $match: {
        'status.isPublished': true,
        'status.isApproved': true,
        type: type,
        $or: [
          { theme: themeName?._id },
          { theme: slug === 'allthemes' ? { $ne: { theme: null } } : null },
        ],
      },
    },
    {
      $lookup: {
        from: 'templates',
        let: { categoryId: '$_id' },
        pipeline: [
          {
            $match: { $expr: { $eq: ['$category', '$$categoryId'] } },
          },
        ],
        as: 'countTemplates',
      },
    },

    {
      $project: {
        _id: 1,
        name: 1,
        slug: 1,
        image: 1,
        status: {
          isPublished: 1,
          isApproved: 1,
          isCollection: 1,
          isNew: 1,
          isFeatured: 1,
          isExclusive: 1,
        },
        theme: 1,
        totalSection: {
          // publish and approved the total section
          $size: {
            $filter: {
              input: '$countTemplates',
              as: 'template',
              cond: {
                $and: [
                  { $eq: ['$$template.status.isPublished', true] },
                  { $eq: ['$$template.status.isApproved', true] },
                ],
              },
            },
          },
        },
      },
      // add totalSections
    },
  ]);
  let categories = [];
  if (type === 'templates') {
    categories = categoriesDataTemplate;
  } else {
    categories = categoriesData;
  }

  // count total sections
  const totalSections = await SectionModel.countDocuments({
    'status.isPublished': true,
    'status.isApproved': true,

    $or: [
      { theme: themeName?._id, slug: themeName?.slug },
      { theme: { $ne: themeName?._id }, slug: themeName?.slug },
    ],
  });

  // count total templates
  const totalTemplates = await TemplateModel.countDocuments({
    'status.isPublished': true,
    'status.isApproved': true,

    $or: [{ theme: themeName?._id }, { theme: { $ne: themeName?._id } }],
  });

  let total = 0;
  if (type === 'templates') {
    total = totalTemplates;
  } else {
    total = totalSections;
  }

  try {
    return { info, themes, categories, total };
  } catch (e: any) {
    throw new Error(e.message);
  }
}

// find category by slug privet function
export async function getCategoryBySlugPrivet(
  theme: string,
  slug: string,
  type: string,
) {
  // find theme name based on slug
  const themeName = await ThemeModel.findOne({ slug: theme }, { _id: 1 });
  // aggregate category and list all the templates specific category
  const templates = await CategoryModel.aggregate([
    {
      $match: {
        'status.isPublished': true,
        'status.isApproved': true,
        slug,
        $or: [
          { theme: themeName?._id },
          {
            theme: theme === 'allthemes' ? { $ne: { theme: null } } : null,
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'templates',
        let: { categoryId: '$_id' },
        pipeline: [
          {
            $match: { $expr: { $eq: ['$category', '$$categoryId'] } },
          },
          {
            $match: {
              // based on category id and status is published and approved
              'status.isPublished': true,
              'status.isApproved': true,
            },
          },
        ],
        as: 'templates',
      },
    },

    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        slug: 1,
        image: 1,
        templates: {
          // remove code and return all the published and approved templates
          $map: {
            input: '$templates',
            as: 'template',
            in: {
              _id: '$$template._id',
              templateName: '$$template.templateName',
              instruction: '$$template.slug',
              previewImg: '$$template.previewImg',
              description: '$$template.description',
              credit: '$$template.credit',
              requirements: '$$template.requirements',
              tags: '$$template.tags',
              isPublished: '$$template.status.isPublished',
              isApproved: '$$template.status.isApproved',
              isCollection: '$$template.status.isCollection',
              isExclusive: '$$template.status.isExclusive',
              isNew: '$$template.status.isNew',
              isFeatured: '$$template.status.isFeatured',
              isDeleted: '$$template.status.isDeleted',
            },
          },
        },

        totalTemplates: {
          $size: {
            $filter: {
              input: '$templates',
              as: 'template',
              cond: {
                $and: [
                  { $eq: ['$$template.status.isPublished', true] },
                  { $eq: ['$$template.status.isApproved', true] },
                ],
              },
            },
          },
        },
      },
    },
  ]);

  // aggregate category and list all the section specific category
  const category = await CategoryModel.aggregate([
    {
      $match: {
        'status.isPublished': true,
        'status.isApproved': true,
        slug,
        $or: [
          { theme: themeName?._id },
          {
            theme: theme === 'allthemes' ? { $ne: { theme: null } } : null,
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'sections',
        let: { categoryId: '$_id' },
        pipeline: [
          {
            $match: { $expr: { $eq: ['$category', '$$categoryId'] } },
          },
          {
            $match: {
              // based on category id and status is published and approved
              'status.isPublished': true,
              'status.isApproved': true,
            },
          },
        ],
        as: 'sections',
      },
    },

    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        slug: 1,
        image: 1,
        sections: {
          // hode code and return all
          $map: {
            input: '$sections',
            as: 'section',
            in: {
              _id: '$$section._id',
              sectionName: '$$section.sectionName',
              instruction: '$$section.instruction',
              previewImg: '$$section.previewImg',
              description: '$$section.description',
              credit: '$$section.credit',
              requirements: '$$section.requirements',
              tags: '$$section.tags',
              isPublished: '$$section.status.isPublished',
              isApproved: '$$section.status.isApproved',
              isExclusive: '$$section.status.isExclusive',
              isCollection: '$$section.status.isCollection',
              isNew: '$$section.status.isNew',
              isFeatured: '$$section.status.isFeatured',
              isDeleted: '$$section.status.isDeleted',
            },
          },
        },

        totalSections: {
          $size: '$sections',
        },
      },
    },
  ]);
  let categoryData = {};
  if (type === 'templates') {
    categoryData = templates[0];
  } else {
    categoryData = category[0];
  }
  try {
    return categoryData || [];
  } catch (e: any) {
    throw new Error(e.message);
  }
}

// find template by slug public function
export async function getCategoryBySlug(
  theme: string,
  slug: string,
  type: string,
) {
  // find theme name based on slug
  const themeName = await ThemeModel.findOne({ slug: theme }, { _id: 1 });
  // aggregate category and list all the templates specific category
  const templates = await CategoryModel.aggregate([
    {
      $match: {
        'status.isPublished': true,
        'status.isApproved': true,
        slug,
        $or: [
          { theme: themeName?._id },
          {
            theme: theme === 'allthemes' ? { $ne: { theme: null } } : null,
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'templates',
        let: { categoryId: '$_id' },
        pipeline: [
          {
            $match: { $expr: { $eq: ['$category', '$$categoryId'] } },
          },
          {
            $match: {
              // based on category id and status is published and approved
              'status.isPublished': true,
              'status.isApproved': true,
            },
          },
        ],
        as: 'templates',
      },
    },

    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        slug: 1,
        image: 1,
        templates: {
          // remove code and return all the published and approved templates
          $map: {
            input: '$templates',
            as: 'template',
            in: {
              _id: '$$template._id',
              templateName: '$$template.templateName',
              instruction: '$$template.slug',
              previewImg: '$$template.previewImg',
              description: '$$template.description',
              credit: '$$template.credit',
              requirements: '$$template.requirements',
              tags: '$$template.tags',
              isPublished: '$$template.status.isPublished',
              isApproved: '$$template.status.isApproved',
              isCollection: false,
              isExclusive: '$$template.status.isExclusive',
              isNew: '$$template.status.isNew',
              isFeatured: '$$template.status.isFeatured',
              isDeleted: '$$template.status.isDeleted',
            },
          },
        },

        totalTemplates: {
          $size: {
            $filter: {
              input: '$templates',
              as: 'template',
              cond: {
                $and: [
                  { $eq: ['$$template.status.isPublished', true] },
                  { $eq: ['$$template.status.isApproved', true] },
                ],
              },
            },
          },
        },
      },
    },
  ]);

  // aggregate category and list all the section specific category
  const category = await CategoryModel.aggregate([
    {
      $match: {
        'status.isPublished': true,
        'status.isApproved': true,
        slug,
        $or: [
          { theme: themeName?._id },
          {
            theme: theme === 'allthemes' ? { $ne: { theme: null } } : null,
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'sections',
        let: { categoryId: '$_id' },
        pipeline: [
          {
            $match: { $expr: { $eq: ['$category', '$$categoryId'] } },
          },
          {
            $match: {
              // based on category id and status is published and approved
              'status.isPublished': true,
              'status.isApproved': true,
            },
          },
        ],
        as: 'sections',
      },
    },

    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        slug: 1,
        image: 1,
        sections: {
          // hode code and return all
          $map: {
            input: '$sections',
            as: 'section',
            in: {
              _id: '$$section._id',
              sectionName: '$$section.sectionName',
              instruction: '$$section.instruction',
              previewImg: '$$section.previewImg',
              description: '$$section.description',
              credit: '$$section.credit',
              requirements: '$$section.requirements',
              tags: '$$section.tags',
              isPublished: '$$section.status.isPublished',
              isApproved: '$$section.status.isApproved',
              isExclusive: '$$section.status.isExclusive',
              isCollection: false,
              isNew: '$$section.status.isNew',
              isFeatured: '$$section.status.isFeatured',
              isDeleted: '$$section.status.isDeleted',
              // isHTML: !!'$$section.code.html.html',
              // isREACT: !!'$$section.code.react.html',
              // retrun tru or false based code.html.html is exist or not
              isHtml: {
                $cond: [{ $ne: ['$$section.code.html.html', ''] }, true, false],
              },
              isREACT: {
                $cond: [
                  { $ne: ['$$section.code.react.html', ''] },
                  true,
                  false,
                ],
              },
              isVUE: {
                $cond: [{ $ne: ['$$section.code.vue.html', ''] }, true, false],
              },
              isANGULAR: {
                $cond: [
                  { $ne: ['$$section.code.angular.html', ''] },
                  true,
                  false,
                ],
              },
            },
          },
        },

        totalSections: {
          $size: '$sections',
        },
      },
    },
  ]);
  let categoryData = {};
  if (type === 'templates') {
    categoryData = templates[0];
  } else {
    categoryData = category[0];
  }
  try {
    return categoryData || [];
  } catch (e: any) {
    throw new Error(e.message);
  }
}

// update category status by id
export async function updateCategoryStatus(id: string, status: any) {
  switch (status) {
    case 'publish':
      status = {
        'status.isPublished': true,
      };
      break;
    case 'disable':
      status = {
        'status.isPublished': false,
      };
      break;
    case 'unapprove':
      status = {
        'status.isApproved': false,
      };
      break;
    case 'approve':
      status = {
        'status.isApproved': true,
        'status.isPublished': true,
      };
      break;
    default:
      status = {
        'status.isDeleted': true,
      };
      break;
  }

  try {
    return await CategoryModel.findByIdAndUpdate(
      id,
      { $set: status },
      { new: true },
    );
  } catch (e: any) {
    throw new Error(e.message);
  }
}

// update category services function
export async function updateCategory(
  id: string,
  previewImg: any,
  input: CategoryDocument,
) {
  let categoryInput;
  if (previewImg) {
    //  upload to cludinary
    const previewImgData = await cloudinary.uploader.upload(previewImg);
    categoryInput = {
      ...input,
      image: previewImgData.secure_url,
      // update id from cloudinary
      imageId: previewImgData.public_id,
    };
  } else {
    categoryInput = {
      ...input,
    };
  }
  try {
    return await CategoryModel.findByIdAndUpdate(id, categoryInput, {
      new: true,
      lean: true,
    });
  } catch (e: any) {
    throw new Error(e.message);
  }
}

// delete category services function
export async function deleteCategory(id: string) {
  try {
    return await CategoryModel.findByIdAndDelete(id);
  } catch (e: any) {
    throw new Error(e.message);
  }
}
