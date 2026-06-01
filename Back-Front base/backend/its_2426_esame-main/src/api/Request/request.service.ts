import { Types } from "mongoose";
import { RequestPermesso } from "./request.entity";
import { RequestModel } from "./request.model";

export class RequestService {

  // CREA UNA NUOVA RICHIESTA
  async createRequest(data: RequestPermesso) {
    const newRequest = await RequestModel.create(data);
    return newRequest;
  }

  // TROVA TUTTE LE RICHIESTE DI UN UTENTE
  async getRequestsByUser(userId: string) {
    return await RequestModel.find({ utenteId: userId }).sort({ createdAt: -1 }).exec();
  }

  // TROVA TUTTE LE RICHIESTE CHE IL RESPONSABILE PUÒ VALUTARE
  async getRequestsForApproval(managerId: string) {
    return await RequestModel.find().sort({ createdAt: -1 }).exec();
  }

  // TROVA UNA RICHIESTA PER ID
  async getRequestById(id: string) {
    return await RequestModel.findById(id).exec();
  }

  // AGGIORNA UNA RICHIESTA (PUT)
  async updateRequest(id: string, updates: Partial<RequestPermesso>) {
    const request = await RequestModel.findByIdAndUpdate(id, updates, { new: true });
    return request;
  }

  // CAMBIA LO STATO DI UNA RICHIESTA (APPROVATO / RIFIUTATO)
  async changeStatus(id: string, stato: "Approvato" | "Rifiutato", valutatoreId: string) {
    const request = await RequestModel.findById(id);
    if (!request) return null;

    request.stato = stato;
    request.utenteValutazioneId = valutatoreId;
    request.dataValutazione = new Date();

    await request.save();
    return request;
  }

  // ELIMINAZIONE (soft delete: può essere solo da “In attesa”)
  async deleteRequest(id: string) {
    const request = await RequestModel.findById(id);
    if (!request) return null;

    await request.deleteOne(); // oppure puoi fare soft delete impostando uno stato
    return true;
  }

  // APPROVA UNA RICHIESTA (solo responsabili)
async approveRequest(id: string, valutatoreId: string) {
  const request = await RequestModel.findById(id);
  if (!request) return null;

  request.stato = "Approvato";
  request.utenteValutazioneId = valutatoreId;
  request.dataValutazione = new Date();

  await request.save();
  return request;
}

// RIFIUTA UNA RICHIESTA (solo responsabili)
async rejectRequest(id: string, valutatoreId: string) {
  const request = await RequestModel.findById(id);
  if (!request) return null;

  request.stato = "Rifiutato";
  request.utenteValutazioneId = valutatoreId;
  request.dataValutazione = new Date();

  await request.save();
  return request;
}

// TROVA TUTTE LE RICHIESTE IN ATTESA (solo responsabili)
async getRequestsToApprove() {
  // Filtra solo le richieste con stato "In attesa"
  return await RequestModel.find({ stato: "In attesa" }).sort({ createdAt: -1 }).exec();
}




}

