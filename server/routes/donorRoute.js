import express from 'express';
import { addDonor, deleteDonor, getDonor, getDonorByEmail, getDonors, getLeaderboardDonors, updateDonor, updateDonorLocation } from '../controllers/donorController.js';

const DonorRoute = express.Router();

DonorRoute.post('/add-donor', addDonor);
DonorRoute.get('/donors', getDonors);
DonorRoute.get('/:donorid', getDonor);
DonorRoute.put('/email/:email', updateDonor);
DonorRoute.delete('/email/:email', deleteDonor);
DonorRoute.get('/donors/leaderboard', getLeaderboardDonors);
DonorRoute.get('/email/:email', getDonorByEmail);
DonorRoute.put('/update-location/:email', updateDonorLocation);

export default DonorRoute;