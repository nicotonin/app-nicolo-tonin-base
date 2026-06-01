import { Router } from "express";
import {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequestById,
  deleteRequestById,
  getRequestsToApprove,
  approveRequest,
  rejectRequest
} from "./request.controller";

const router = Router();


router.get("/", getAllRequests);
router.post("/", createRequest);
router.get("/da-approvare", getRequestsToApprove); 
router.get("/:id", getRequestById);
router.put("/:id", updateRequestById);
router.put("/:id/approva", approveRequest);
router.put("/:id/rifiuta", rejectRequest);
router.delete("/:id", deleteRequestById);


export default router;
