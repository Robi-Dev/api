import TemplateModel from '../models/template.model';
import cloudinary from '../utils/cloudinary';

export async function createTemplate(input: any, previewImg: any) {
  let sectionInput;
  if (previewImg) {
    //  upload to cludinary
    const previewImgData = await cloudinary.uploader.upload(previewImg);
    sectionInput = {
      ...input,
      previewImg: previewImgData.secure_url,
      // image id from cloudinary
      imageId: previewImgData.public_id,
    };
  } else {
    sectionInput = {
      ...input,
    };
  }

  try {
    return await TemplateModel.create(sectionInput);
  } catch (e: any) {
    throw new Error(e.message);
  }
}

// get all templates controller function
export async function getAllTemplates(query: any, isAdmin: boolean) {
  try {
    if (isAdmin) {
      return await TemplateModel.find({})
        .populate('category', ['name', 'slug'])
        .populate('user', 'fullName')
        .populate('theme', ['name', 'slug'])
        .lean(true);
    } else {
      return await TemplateModel.find(query)
        .populate('category', ['name', 'slug'])
        .populate('user', 'fullName')
        .populate('theme', ['name', 'slug'])
        .lean(true);
    }
  } catch (e: any) {
    throw new Error(e.message);
  }
}

// get all templates public controller function
export async function getAllTemplatesPublic() {
  try {
    return await TemplateModel.find({
      'status.isPublished': true,
      'status.isApproved': true,
    });
  } catch (e: any) {
    throw new Error(e.message);
  }
}

// get templates by slug controller function
export async function getTemplateBySlug(slug: string) {
  try {
    return await TemplateModel.findOne(
      {
        slug,
        'status.isPublished': true,
        'status.isApproved': true,
      },
      {
        id: 1,
        slug: 1,
        status: 1,
        user: 1,
        theme: 1,
        category: 1,
        templateName: 1,
        previewImg: 1,
        description: 1,
        instruction: 1,
        credit: 1,
        requirements: 1,
        tags: 1,
      },
    );
  } catch (e: any) {
    throw new Error(e.message);
  }
}

// get templates by id controller function
export async function getTemplateById(id: string) {
  try {
    return await TemplateModel.findById(
      {
        _id: id,
        'status.isPublished': true,
        'status.isApproved': true,
      },
      {
        id: 1,
        html: '$code.html.html' || '',
        react: '$code.react.html' || '',
        vue: '$code.vue.html' || '',
        angular: '$code.angular.html' || '',
      },
    );
  } catch (e: any) {
    throw new Error(e.message);
  }
}

// get templates details by id controller function
export async function getTemplateDetailsById(id: string) {
  try {
    return await TemplateModel.findById({
      _id: id,
      'status.isPublished': true,
      'status.isApproved': true,
    })
      .populate('category', ['name', 'slug'])
      .populate('user', 'fullName')
      .populate('theme', ['name', 'slug'])
      .lean(true);
  } catch (e: any) {
    throw new Error(e.message);
  }
}

// update template controller function
export async function updateTemplate(id: string, previewImg: any, input: any) {
  let templateInput;
  const Input = {
    ...input,
    code: {
      html: {
        html: input.htmlHtml,
        css: input.htmlCss,
        js: input.htmlJs,
      },
      react: {
        html: input.reactHtml,
        css: input.reactCss,
        js: input.reactJs,
      },
      vue: {
        html: input.vueHtml,
        css: input.vueCss,
        js: input.vueJs,
      },
      angular: {
        html: input.angularHtml,
        css: input.angularCss,
        js: input.angularJs,
      },
    },
  };
  if (previewImg) {
    //  upload to cludinary
    const previewImgData = await cloudinary.uploader.upload(previewImg);
    templateInput = {
      ...Input,
      previewImg: previewImgData.secure_url,
      // image id from cloudinary
      imageId: previewImgData.public_id,
    };
  } else {
    templateInput = {
      ...Input,
    };
  }

  try {
    return await TemplateModel.findByIdAndUpdate(id, templateInput, {
      new: true,
    });
  } catch (e: any) {
    throw new Error(e.message);
  }
}

// update template status controller function
export async function updateTemplateStatus(id: string, status: any) {
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
    case 'approve':
      status = {
        'status.isApproved': true,
      };
      break;
    case 'unapprove':
      status = {
        'status.isApproved': false,
      };
      break;
    default:
      // status not found return error
      throw new Error('status not found');
  }
  try {
    return await TemplateModel.findByIdAndUpdate(id, status, {
      new: true,
      lean: true,
    });
  } catch (e: any) {
    throw new Error(e.message);
  }
}

// delete a template controller function
export async function deleteTemplate(templateId: string) {
  try {
    return await TemplateModel.findByIdAndDelete(templateId);
  } catch (e: any) {
    throw new Error(e.message);
  }
}
