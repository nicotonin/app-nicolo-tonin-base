import { model, Schema } from "mongoose";

const analisiSchema = new Schema(
  {
    name: { type: String, required: true }
  },
  { timestamps: true }
);

analisiSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    delete (ret as unknown as any)._id;
    delete (ret as unknown as any).__v;
    return ret;
  }
});

analisiSchema.set("toObject", {
  virtuals: true,
  transform: (_, ret) => {
    delete (ret as unknown as any)._id;
    delete (ret as unknown as any).__v;
    return ret;
  }
});

export const AnalisiModel = model("Analisi", analisiSchema);