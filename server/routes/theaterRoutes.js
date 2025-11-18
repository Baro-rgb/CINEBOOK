import express from "express";
import { 
    getAllTheaters, 
    getTheater, 
    addTheater, 
    updateTheater, 
    deleteTheater,
    getDistricts 
} from "../controllers/theaterController.js";
import { protectAdmin } from "../middleware/auth.js";

const theaterRouter = express.Router();

// Public routes
theaterRouter.get("/all", getAllTheaters);
theaterRouter.get("/districts", getDistricts);
theaterRouter.get("/:theaterId", getTheater);

// Admin routes
theaterRouter.post("/add", protectAdmin, addTheater);
theaterRouter.put("/update/:theaterId", protectAdmin, updateTheater);
theaterRouter.delete("/delete/:theaterId", protectAdmin, deleteTheater);

export default theaterRouter;