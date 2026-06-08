import { model, Schema } from "mongoose";

const {{name}}Schema = new Schema(
  {
    name: { type: String, required: true }
  },
  { timestamps: true }
);

{{name}}Schema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    delete (ret as unknown as any)._id;
    delete (ret as unknown as any).__v;
    return ret;
  }
});

{{name}}Schema.set("toObject", {
  virtuals: true,
  transform: (_, ret) => {
    delete (ret as unknown as any)._id;
    delete (ret as unknown as any).__v;
    return ret;
  }
});

export const {{Name}}Model = model("{{Name}}", {{name}}Schema);