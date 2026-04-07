// backend/src/models/Product.ts
import mongoose, { Document, Schema, Model } from 'mongoose';
import slugify from 'slugify';

export interface IProductSize {
  size: number;
  isBlocked: boolean;
}

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category:
    | 'skechers'
    | 'new-drops'
    | 'formal-collection'
    | 'lace-up'
    | 'chunky-formals'
    | 'best-selling'
    | 'casual-collection'
    | 'peshawari-sandals'
    | 'sandals'
    | 'slippers'
    | 'boots'
    | 'loafers'
    | 'moccasins'
    | 'sneakers'
    | 'monaco';
  sizes: IProductSize[];
  colors: string[];
  images: string[];
  stock: number;
  isVisible: boolean;
  isDiscontinued: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const productSizeSchema = new Schema<IProductSize>(
  {
    size: {
      type: Number,
      required: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    compareAtPrice: {
      type: Number,
      default: undefined,
    },
    category: {
      type: String,
      enum: [
        'skechers',
        'new-drops',
        'formal-collection',
        'lace-up',
        'chunky-formals',
        'best-selling',
        'casual-collection',
        'peshawari-sandals',
        'sandals',
        'slippers',
        'boots',
        'loafers',
        'moccasins',
        'sneakers',
        'monaco',
      ],
      required: [true, 'Category is required'],
    },
    sizes: {
      type: [productSizeSchema],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (v: string[]) => v.length <= 8,
        message: 'A product can have at most 8 images',
      },
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    isDiscontinued: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from name before saving
productSchema.pre<IProduct>('save', async function (next) {
  if (!this.isModified('name')) return next();

  const baseSlug = slugify(this.name, {
    lower: true,
    strict: true,
    trim: true,
  });

  // Ensure slug is unique
  let slug = baseSlug;
  let counter = 1;
  const ProductModel = mongoose.model('Product');

  while (true) {
    const existing = await ProductModel.findOne({
      slug,
      _id: { $ne: this._id },
    });
    if (!existing) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  this.slug = slug;
  next();
});

// Create indexes for performance
productSchema.index({ category: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isNewArrival: 1 });
productSchema.index({ isVisible: 1, isDiscontinued: 1 });
productSchema.index({ name: 'text', tags: 'text' });

const Product: Model<IProduct> = mongoose.model<IProduct>(
  'Product',
  productSchema
);

export default Product;
