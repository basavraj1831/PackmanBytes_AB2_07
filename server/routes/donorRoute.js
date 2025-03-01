import express from 'express';
import { addDonor, deleteDonor, getDonor, getDonors, updateDonor } from '../controllers/donorController.js';

const DonorRoute = express.Router();

DonorRoute.post('/add-donor', addDonor);
DonorRoute.get('/:donorid', getDonor);
DonorRoute.put('/:id', updateDonor);
DonorRoute.delete('/donor/:id', deleteDonor);
DonorRoute.get('/donors', getDonors);

export default DonorRoute;