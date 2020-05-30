const Schema = require("mongoose").Schema;

const AvatarImageSchema = new Schema({
  dataUri: String,
  mimeType: String,
  name: String,
  size: Number,
  md5: String,
  encoding: String,
});

const AnswerSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    givenName: String,
    familyName: String,
    senderTitle: String,
    body: String,
    like: Number,
  },
  { timestamps: true }
);

const QuestionSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    avatarImage: AvatarImageSchema,
    givenName: String,
    familyName: String,
    senderTitle: String,
    title: String,
    body: String,
    like: Number,
    answers: [AnswerSchema],
  },
  { timestamps: true }
);

module.exports = QuestionSchema;
