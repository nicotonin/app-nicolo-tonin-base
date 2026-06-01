import { Schema, model } from "mongoose";
import { RequestPermesso } from "./request.entity";

const requestSchema = new Schema<RequestPermesso>(
  {
    dataRichiesta: { type: Date, required: true, default: () => new Date() },
    dataInizio: { type: Date, required: true },
    dataFine: { type: Date, required: true },
    categoriaId: { type: String, required: true },
    motivazione: { type: String, required: true },
    stato: { type: String, enum: ["In attesa", "Approvato", "Rifiutato"], default: "In attesa" },
    utenteId: { type: String, required: true },
    dataValutazione: { type: Date },
    utenteValutazioneId: { type: String },
  },
  { timestamps: true }
);

requestSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const RequestModel = model<RequestPermesso>("RichiestaPermesso", requestSchema);
