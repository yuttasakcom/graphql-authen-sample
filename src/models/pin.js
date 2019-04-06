import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PinSchema = new Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: String,
    latitude: Number,
    longitude: Number,
    author: {
      type: Schema.ObjectId,
      ref: "user",
    },
    comments: [
      {
        type: Schema.ObjectId,
        ref: "comment",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("pin", PinSchema);
