const Schema = require("mongoose").Schema;

const AvatarImageSchema = new Schema({
  dataUri: String,
  mimeType: String,
  name: String,
  size: Number,
  md5: String,
  encoding: String,
});

const InstructorSchema = new Schema(
  {
    avatarImage: AvatarImageSchema,
    givenName: String,
    familyName: String,
    senderTitle: String,
    title: String,
    description: String,
    studentsNo: Number,
    coursesNo: Number,
    rating: Number,
  },
  { timestamps: true }
);

module.exports = InstructorSchema;
