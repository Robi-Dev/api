import CategoryModel from '../models/category.model';
import CollectionModel from '../models/collection.model';
import SectionModel from '../models/section.model';
import TemplateModel from '../models/template.model';

// create a collection model function
export async function createCollection(input: any, userId: any) {
  let data;
  let collection;
  const status = {
    'status.isCollection': true,
  };
  if (input.type === 'templates' && input.isCategory) {
    data = {
      category: input.collectionId,
      user: userId,
      isCategory: true,
      type: input.type,
    };
    collection = await CollectionModel.create(data);
    await CategoryModel.findByIdAndUpdate(input.collectionId, status, {
      new: true,
      lean: true,
    });
  } else if (input.type === 'templates' && !input.isCategory) {
    data = {
      template: input.collectionId,
      user: userId,
      isCategory: false,
      type: input.type,
    };
    collection = await CollectionModel.create(data);
    await TemplateModel.findByIdAndUpdate(input.collectionId, status, {
      new: true,
      lean: true,
    });
  } else if (input.type === 'components' && input.isCategory) {
    data = {
      category: input.collectionId,
      user: userId,
      isCategory: true,
      type: input.type,
    };
    collection = await CollectionModel.create(data);
    await CategoryModel.findByIdAndUpdate(input.collectionId, status, {
      new: true,
      lean: true,
    });
  } else if (input.type === 'components' && !input.isCategory) {
    data = {
      section: input.collectionId,
      user: userId,
      isCategory: false,
      type: input.type,
    };
    collection = await CollectionModel.create(data);
    await SectionModel.findByIdAndUpdate(input.collectionId, status, {
      new: true,
      lean: true,
    });
  }
  try {
    return collection;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

// find all collections controller function
export async function findCollectionsByType(
  type: string,
  userId: any,
  input: any,
) {
  let collections: any = [];
  switch (type) {
    case 'components':
      if (input.isCategory) {
        collections = await CollectionModel.find({
          type,
          isCategory: true,
          user: userId,
        }).populate('category', {
          name: 1,
          status: {
            isPublished: 1,
            isApproved: 1,
            isNew: 1,
            isExclusive: 1,
            isFeatured: 1,
          },
          image: 1,
        });
      } else {
        collections = await CollectionModel.find({
          type,
          isCategory: false,
          user: userId,
        }).populate('section', {
          sectionName: 1,
          status: {
            isPublished: 1,
            isApproved: 1,
            isNew: 1,
            isExclusive: 1,
            isFeatured: 1,
          },
          previewImg: 1,
        });
      }
      break;
    case 'templates':
      if (input.isCategory) {
        collections = await CollectionModel.find({
          type,
          isCategory: true,
          user: userId,
        }).populate('category', {
          name: 1,
          status: {
            isPublished: 1,
            isApproved: 1,
            isNew: 1,
            isExclusive: 1,
            isFeatured: 1,
          },
          image: 1,
        });
      } else if (!input.isCategory) {
        collections = await CollectionModel.find({
          type,
          isCategory: false,
          user: userId,
        }).populate('template', {
          templateName: 1,
          previewImg: 1,
          status: {
            isPublished: 1,
            isApproved: 1,
            isNew: 1,
            isExclusive: 1,
            isFeatured: 1,
          },
          html: '$code.html.html' || '',
          react: '$code.react.html' || '',
          vue: '$code.vue.html' || '',
          angular: '$code.angular.html' || '',
        });
      }
      break;
    default:
      // return error message
      throw new Error('Invalid type');
  }

  try {
    return collections;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

// delete collection controller function
export async function deleteCollection(Id: any, userId: any, input: any) {
  let collection: any;
  const status = {
    'status.isCollection': false,
  };
  const there = await CollectionModel.findOne({
    _id: Id,
    user: userId,
  });

  if (input.type === 'templates' && input.isCategory) {
    if (there) {
      await CategoryModel.findByIdAndUpdate(input.collectionId, status, {
        new: true,
        lean: true,
      });
      collection = await CollectionModel.findOneAndDelete({
        _id: Id,
        user: userId,
      });
    } else {
      throw new Error('Collection does not exist');
    }
  } else if (input.type === 'templates' && !input.isCategory) {
    if (there) {
      await TemplateModel.findByIdAndUpdate(input.collectionId, status, {
        new: true,
        lean: true,
      });
      collection = await CollectionModel.findOneAndDelete({
        _id: Id,
        user: userId,
      });
    } else {
      throw new Error('Collection does not exist');
    }
  } else if (input.type === 'components' && input.isCategory) {
    if (there) {
      await CategoryModel.findByIdAndUpdate(input.collectionId, status, {
        new: true,
        lean: true,
      });
      collection = await CollectionModel.findOneAndDelete({
        _id: Id,
        user: userId,
      });
    } else {
      throw new Error('Collection does not exist');
    }
  } else if (input.type === 'components' && !input.isCategory) {
    if (there) {
      await SectionModel.findByIdAndUpdate(input.collectionId, status, {
        new: true,
        lean: true,
      });
      collection = await CollectionModel.findOneAndDelete({
        _id: Id,
        user: userId,
      });
    } else {
      throw new Error('Collection does not exist');
    }
  }
  try {
    return collection;
  } catch (e: any) {
    throw new Error(e.message);
  }
}
