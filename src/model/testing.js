import mongoose from "mongoose";

const testingSchema = new mongoose.Schema(
  {
    base64image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Testing", testingSchema);
