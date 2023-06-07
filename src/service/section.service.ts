// import from utils
import cloudinary from '../utils/cloudinary';
import SectionModel from '../models/section.model';

// create Section  function
export async function createSection(input: any, previewImg: any) {
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
    return await SectionModel.create(sectionInput);
  } catch (e: any) {
    throw new Error(e.message);
  }
}

// get Section  function by section id
export async function getSection(query: string) {
  try {
    return await SectionModel.findOne({ _id: query })
      .populate('theme', ['name', '_id'])
      .populate('category', ['name', '_id']);
  } catch (e: any) {
    throw new Error(e.message);
  }
}

// get section by ID private
export async function getSectionById(sectionId: string) {
  try {
    return await SectionModel.findById(
      {
        _id: sectionId,
        'status.isPublished': true,
        'status.isApproved': true,
      },
      {
        id: 1,
        html: '$code.html.html' || '',
        react: '$code.react.html' || '',
        vue: '$code.vue.html' || '',
        angular: '$code.angular.html' || '',
        slug: 1,
      },
    );
  } catch (e: any) {
    throw new Error(e.message);
  }
}

// find Section  function
export async function findSection(query: any, isAdmin: boolean) {
  try {
    if (isAdmin) {
      return await SectionModel.find({})
        .populate('category', ['name', 'slug'])
        .populate('user', 'fullName')
        .populate('theme', ['name', 'slug'])
        .lean(true);
    } else {
      return await SectionModel.find(query)
        .populate('category', ['name', 'slug'])
        .populate('user', 'fullName')
        .lean(true);
    }
  } catch (e: any) {
    throw new Error(e.message);
  }
}

// find public sections
export async function findSectionPublic() {
  try {
    return await SectionModel.find({
      'status.isPublic': true,
      'status.isApproved': true,
    });
  } catch (e: any) {
    throw new Error(e.message);
  }
}

// update Section  function
export async function updateSection(Id: string, previewImg: any, input: any) {
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
    return await SectionModel.findByIdAndUpdate(Id, sectionInput, {
      new: true,
      lean: true,
    });
  } catch (e: any) {
    throw new Error(e.message);
  }
}

// delete Section  function
export async function deleteSection(id: string) {
  try {
    return await SectionModel.findByIdAndDelete(id);
  } catch (e: any) {
    throw new Error(e.message);
  }
}

// update status by id
export async function updateStatus(id: string, status: any) {
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
        'status.isPublished': true,
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
    return await SectionModel.findByIdAndUpdate(id, status, {
      new: true,
      lean: true,
    });
  } catch (e: any) {
    throw new Error(e.message);
  }
}
