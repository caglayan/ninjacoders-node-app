const Schema = require("mongoose").Schema;

const CourseSchema = new Schema(
  {
    group_id: Schema.ObjectId,
    abilities: {
      type: Array,
      default: ["NinjaCoders", "Kodlama", "Robotik"],
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    thumbnail: String,
    instructorId: String,
    commentId: String,
    description: {
      header: String,
      parap1: String,
      parap2: String,
    },
    bestComment: Object,
    instructor: Object,
    premium: Object,
    statistics: Object,
    isBelongNinja: Boolean,
    purchaseNumber: Number,
    chapters: [],
    commentPoint: Number,
    isPremium: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = CourseSchema;
