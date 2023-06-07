import mongoose from 'mongoose'
import { ThemeDocument } from './theme.model'

export interface CategoryDocument {
  _id: string;
  status: {
    isPublished: boolean;
    isApproved: boolean;
    isCollection: boolean;
    isNew: boolean;
    isExclusive: boolean;
    isFeatured: boolean;
  };
  name: string;
  theme: ThemeDocument['_id'];
  image: string;
  description: string;
  slug: string;
  type: string;
}

const categorySchema = new mongoose.Schema({
  status: {
    isPublished: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false },
    isCollection: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    isExclusive: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
  },
  name: { type: String, required: true },
  theme: { type: mongoose.Schema.Types.ObjectId, ref: 'Theme' },
  image: String,
  description: String,
  slug: { type: String, unique: true, required: true },
  type: String,
});

const CategoryModel = mongoose.model<CategoryDocument>(
   'Category',
   categorySchema,
)

export default CategoryModel
