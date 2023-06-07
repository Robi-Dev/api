import mongoose from 'mongoose';

export interface ThemeDocument {
  _id: string
  status: {
    isPublished: boolean
    isActive: boolean
    isPrivate: boolean
  }
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
  icon: string
  slug: string
  type: string
}

const themeSchema = new mongoose.Schema({
  status: {
    isPublished: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    isPrivate: { type: Boolean, default: false },
  },
  name: { type: String, required: true },
  description: String,
  icon: String,
  slug: { type: String, required: true, unique: true },
  type: String,
});

const ThemeModel = mongoose.model<ThemeDocument>('Theme', themeSchema);

export default ThemeModel;
