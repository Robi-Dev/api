import mongoose from 'mongoose';
import { CategoryDocument } from './category.model';
import { SectionDocument } from './section.model';
import { TemplateDocument } from './template.model';
import { UserDocument } from './user.model';

// section collection document
export interface CollectionDocument {
  _id: string;
  user: UserDocument['_id'];
  category: CategoryDocument['_id'];
  section: SectionDocument['_id'];
  template: TemplateDocument['_id'];
  isCategory: boolean;
  type: string;
}

// section collection schema
const CollectionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
  isCategory: { type: Boolean, default: false },
  type: { type: String, required: true },
});

// section collection model
const CollectionModel = mongoose.model<CollectionDocument>(
  'Collection',
  CollectionSchema,
);
export default CollectionModel;
