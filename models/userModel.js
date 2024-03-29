var Schema = require("mongoose").Schema;

const AvatarImageSchema = new Schema(
  {
    dataUri: String,
    mimeType: String,
    name: String,
    size: Number,
    md5: String,
    encoding: String,
  },
  { timestamps: true }
);

const RegisteredCourseSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    thumbnail: String,
    wathedVideos: [String],
    rating: Number,
    students: Number,
    videos: Number,
    duration: Number,
    name: String,
    instructor: Object,
    percentage: Number,
  },
  { timestamps: true }
);

const PremiumCourseGroupSchema = new Schema(
  {
    courseGroup_id: {
      type: Schema.Types.ObjectId,
      ref: "CourseGroup",
      required: true,
    },
    paymentTransactionId: String,
    paidPrice: Number,
  },
  { timestamps: true }
);

const UserSchema = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "is invalid"],
      default: "bos@ninjacoders.co",
      index: true,
      immutable: true,
    },
    passwordHash: String,
    password: {
      type: String,
      required: [false, "can't be blank"],
    },
    googleId: {
      type: String,
      index: true,
    },
    givenName: String,
    familyName: String,
    avatarImageUrl: String,
    //premium: Boolean,
    registeredCourses: [RegisteredCourseSchema],
    premiumCourseGroups: [PremiumCourseGroupSchema],
    token: {
      type: String,
      required: false,
    },
    shoppingCart: [Object],
    notifications: "", //[notificationSchema],
    projects: "", //[ProjectSchema],
    age: Number,
    mobilePhone: String,
    school: String,
    city: String,
    code: Schema.Types.Mixed,
    avatarImage: AvatarImageSchema,
    salt: String,
    type: String,
    isAdmin: {
      type: Boolean,
      default: false,
    },
    courses: "", //[takenCourse],
    doneLectures: "", //[doneWorks],
  },
  { timestamps: true }
);

module.exports = UserSchema;
