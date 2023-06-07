import mongoose from 'mongoose';
import { CategoryDocument } from './category.model';
import { ThemeDocument } from './theme.model';
import { UserDocument } from './user.model';

export interface TemplateDocument {
  _id: string;
  user: UserDocument['_id'];
  status: {
    isPublished: boolean;
    isApproved: boolean;
    isDeleted: boolean;
    isNew: boolean;
    isFeatured: boolean;
    isExclusive: boolean;
  };
  theme: ThemeDocument['name'];
  category: CategoryDocument['name'];
  templateName: string;
  previewImg: string;
  imageId: string;
  description: string;
  instruction: string;
  credit: string;
  requirements: string;
  tags: Array<string>;
  code: {
    html: {
      html: string;
      css: string;
      js: string;
    };
    react: {
      html: string;
      css: string;
      js: string;
    };
    vue: {
      html: string;
      css: string;
      js: string;
    };
    angular: {
      html: string;
      css: string;
      js: string;
    };
  };
}

const themeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    isPublished: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isExclusive: { type: Boolean, default: false },
  },
  theme: { type: mongoose.Schema.Types.ObjectId, ref: 'Theme' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  templateName: { type: String, required: true },
  previewImg: { type: String, required: true },
  imageId: String,
  description: {
    type: String,
    required: true,
  },
  instruction: String,
  credit: String,
  requirements: String,
  tags: { type: Array, required: true },
  code: {
    html: {
      html: { type: String, required: true },
      css: { type: String, default: '' },
      js: { type: String, default: '' },
    },
    react: {
      html: { type: String, default: '' },
      css: { type: String, default: '' },
      js: { type: String, default: '' },
    },
    vue: {
      html: { type: String, default: '' },
      css: { type: String, default: '' },
      js: { type: String, default: '' },
    },
    angular: {
      html: { type: String, default: '' },
      css: { type: String, default: '' },
      js: { type: String, default: '' },
    },
  },
});

const TemplateModel = mongoose.model<TemplateDocument>('Template', themeSchema);

export default TemplateModel;
