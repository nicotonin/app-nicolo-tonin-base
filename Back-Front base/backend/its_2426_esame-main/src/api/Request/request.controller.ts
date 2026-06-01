import { Request, Response, NextFunction } from "express";
import { RequestService } from "./request.service";
import { RequestPermesso } from "./request.entity";

const requestService = new RequestService();

// -----------------------------------
// GET /api/richieste → visualizza richieste
// i dipendenti vedono solo le proprie, i responsabili tutte
export const getAllRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    let requests;
    if (role === "responsabile") {
      // il responsabile vede tutte
      requests = await requestService.getRequestsForApproval(userId!);
    } else {
      // i dipendenti vedono solo le proprie
      requests = await requestService.getRequestsByUser(userId!);
    }

    res.status(200).json(requests);
  } catch (err) {
    next(err);
  }
};

// -----------------------------------
// GET /api/richieste/:id → visualizzazione richiesta singola
export const getRequestById = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;

    const request = await requestService.updateRequest(id, {}); // usiamo findById internamente
    if (!request) res.status(404).json({ message: "Richiesta non trovata" });

    // controlli di visibilità
    if (role !== "responsabile" && request?.utenteId !== userId) {
     res.status(403).json({ message: "Non autorizzato" });
    }

    res.status(200).json(request);
  } catch (err) {
    next(err);
  }
};

// -----------------------------------
// POST /api/richieste → inserimento nuova richiesta
export const createRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { dataInizio, dataFine, categoriaId, motivazione } = req.body;

    const data: RequestPermesso = {
      dataRichiesta: new Date(),
      dataInizio: new Date(dataInizio),
      dataFine: new Date(dataFine),
      categoriaId,
      motivazione,
      stato: "In attesa",
      utenteId: userId!,
    };

    const request = await requestService.createRequest(data);
    res.status(201).json(request);
  } catch (err) {
    next(err);
  }
};

// -----------------------------------
// PUT /api/richieste/:id → modifica richiesta (solo propria e da approvare)
export const updateRequestById = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const updates = req.body;

    const request = await requestService.updateRequest(id, {});
    if (!request) res.status(404).json({ message: "Richiesta non trovata" });
    if (request?.utenteId !== userId)  res.status(403).json({ message: "Non autorizzato" });
    if (request?.stato !== "In attesa") res.status(400).json({ message: "Richiesta già valutata, impossibile modificare" });

    const updatedRequest = await requestService.updateRequest(id, updates);
    res.status(200).json(updatedRequest);
  } catch (err) {
    next(err);
  }
};

// -----------------------------------
// DELETE /api/richieste/:id → eliminazione richiesta
export const deleteRequestById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;

    if (!userId || !role) {
      res.status(401).json({ message: "Utente non autenticato" });
    } else {
      const request = await requestService.getRequestById(id);
      if (!request) {
        res.status(404).json({ message: "Richiesta non trovata" });
      } else {
        // Controlli per dipendente
        if (role !== "responsabile") {
          if (request.utenteId !== userId) {
            res.status(403).json({ message: "Non autorizzato" });
          } else if (request.stato !== "In attesa") {
            res.status(400).json({ message: "Richiesta già valutata, impossibile eliminare" });
          } else {
            // Soft delete per dipendente
            requestService.changeStatus(id, "Rifiutato", userId);
            res.status(200).json({ message: "Richiesta eliminata correttamente" });
          }
        } else {
          // Responsabile può cancellare qualsiasi richiesta
          requestService.changeStatus(id, "Rifiutato", userId);
          res.status(200).json({ message: "Richiesta eliminata correttamente" });
        }
      }
    }
  } catch (err) {
    next(err);
  }
};

export const getRequestsToApprove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = req.user?.role;
    const userId = req.user?.id;

    if (role !== "responsabile" || !userId) {
      res.status(403).json({ message: "Non autorizzato" });
    } else {
      const requests = await requestService.getRequestsToApprove();
      res.status(200).json(requests);
    }
  } catch (err) {
    next(err);
  }
};


// PUT /api/richieste/:id/approva → approvazione richiesta
export const approveRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;

    if (!userId || role !== "responsabile") {
      res.status(403).json({ message: "Non autorizzato" });
    } else {
      const request = await requestService.getRequestById(id);
      if (!request) res.status(404).json({ message: "Richiesta non trovata" });
      else if (request.stato !== "In attesa") res.status(400).json({ message: "Richiesta già valutata" });
      else {
        await requestService.changeStatus(id, "Approvato", userId);
        res.status(200).json({ message: "Richiesta approvata correttamente" });
      }
    }
  } catch (err) {
    next(err);
  }
};

// PUT /api/richieste/:id/rifiuta → rifiuto richiesta
export const rejectRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;

    if (!userId || role !== "responsabile") {
      res.status(403).json({ message: "Non autorizzato" });
    } else {
      const request = await requestService.getRequestById(id);
      if (!request) res.status(404).json({ message: "Richiesta non trovata" });
      else if (request.stato !== "In attesa") res.status(400).json({ message: "Richiesta già valutata" });
      else {
        await requestService.changeStatus(id, "Rifiutato", userId);
        res.status(200).json({ message: "Richiesta rifiutata correttamente" });
      }
    }
  } catch (err) {
    next(err);
  }
};




