const Schema = require("mongoose").Schema;

const Comment = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: String,
    detail: String,
  },
  { timestamps: true }
);

const patronSchema = new Schema({
  givenName: String,
  familyName: String,
  imageUrl: String,
  title: String,
  story: String,
});

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    abilities: {
      type: Array,
      default: ["NinjaCoders", "Kodlama", "Robotik"],
    },
    instructor: Object,
    description: {
      header: String,
      content: String,
    },
    purchaseNumber: Number,
    thumbnail: String,
    commentPoint: Number,
    isBelongNinja: Boolean,
    numberOfSections: Number,
    studentNumber: Number,
    levelPoint: Number,
    duration: Number,
    comments: [Comment],
    chapters: [],
    projects: [],
    patron: patronSchema,
  },
  { timestamps: true }
);

module.exports = ProductSchema;
