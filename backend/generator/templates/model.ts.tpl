import { model, Schema } from "mongoose";

const {{name}}Schema = new Schema(
  {
    name: { type: String, required: true }
  },
  { timestamps: true }
);

export const {{Name}}Model = model("{{Name}}", {{name}}Schema);