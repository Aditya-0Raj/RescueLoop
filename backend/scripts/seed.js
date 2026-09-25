import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../src/config/db.js';
import User from '../src/models/User.js';
import Recipient from '../src/models/Recipient.js';
import Driver from '../src/models/Driver.js';
import Donation from '../src/models/Donation.js';
import Rescue from '../src/models/Rescue.js';
import EventLog from '../src/models/EventLog.js';
import ImpactRecord from '../src/models/ImpactRecord.js';
import { buildRescuePlan } from '../src/services/rescueEngine.js';

function future(hours) {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

async function seed() {
  await connectDB();
  await Promise.all([
    User.deleteMany({}),
    Recipient.deleteMany({}),
    Driver.deleteMany({}),
    Donation.deleteMany({}),
    Rescue.deleteMany({}),
    EventLog.deleteMany({}),
    ImpactRecord.deleteMany({}),
  ]);

  const [donor, recipient1, recipient2, driver1, driver2] = await User.create([
    { publicId: 'USR-DEMO-DONOR', name: 'The Spice House', email: 'donor@rescueloop.local', role: 'donor' },
    { publicId: 'USR-DEMO-NGO1', name: 'City Shelter Network', email: 'recipient@rescueloop.local', role: 'recipient' },
    { publicId: 'USR-DEMO-NGO2', name: 'Hope Kitchen', email: 'recipient2@rescueloop.local', role: 'recipient' },
    { publicId: 'USR-DEMO-DRV1', name: 'Ravi Driver', email: 'driver@rescueloop.local', role: 'driver' },
    { publicId: 'USR-DEMO-DRV2', name: 'Aman Driver', email: 'driver2@rescueloop.local', role: 'driver' },
  ]);

  await Recipient.create([
    {
      publicId: 'NGO-DEMO-01', user: recipient1._id, organizationName: 'City Shelter Network',
      location: 'Bengaluru Central', coordinates: { lat: 12.9716, lng: 77.5946 }, accepting: true,
      capacity: 40, capacityUnit: 'kg', acceptedFoodTypes: ['Veg meals', 'Cooked meal'],
      storageAvailable: ['Hot-held', 'Refrigerated'], openUntil: future(4), lastCapacityUpdatedAt: new Date(),
    },
    {
      publicId: 'NGO-DEMO-02', user: recipient2._id, organizationName: 'Hope Kitchen',
      location: 'Indiranagar, Bengaluru', coordinates: { lat: 12.9784, lng: 77.6408 }, accepting: true,
      capacity: 30, capacityUnit: 'kg', acceptedFoodTypes: ['Veg meals', 'Cooked meal', 'Bakery'],
      storageAvailable: ['Hot-held', 'Ambient'], openUntil: future(3.5), lastCapacityUpdatedAt: new Date(),
    },
  ]);

  await Driver.create([
    {
      publicId: 'DRV-DEMO-01', user: driver1._id, vehicleType: 'Two-wheeler', vehicleCapacity: 35, onDuty: true,
      availableUntil: future(4), currentLocation: 'MG Road, Bengaluru', coordinates: { lat: 12.9759, lng: 77.6023 },
    },
    {
      publicId: 'DRV-DEMO-02', user: driver2._id, vehicleType: 'Car', vehicleCapacity: 80, onDuty: true,
      availableUntil: future(3), currentLocation: 'Ulsoor, Bengaluru', coordinates: { lat: 12.9816, lng: 77.6285 },
    },
  ]);

  const donation = await Donation.create({
    publicId: 'DON-DEMO-01', donor: donor._id, foodName: 'Veg Biryani', foodType: 'Veg meals', quantity: 25, unit: 'kg',
    dietaryType: 'Vegetarian', readyAt: new Date(), safeUntil: future(2), storageState: 'Hot-held',
    location: 'The Spice House, MG Road, Bengaluru', coordinates: { lat: 12.9758, lng: 77.6032 },
    safety: { status: 'passed', checkedAt: new Date(), reasons: [] }, status: 'Posted',
  });

  await buildRescuePlan(donation);

  const deliveredDonation = await Donation.create({
    publicId: 'DON-DEMO-02', donor: donor._id, foodName: 'Mixed Chapati & Dal', foodType: 'Cooked meal', quantity: 14, unit: 'kg',
    dietaryType: 'Vegetarian', readyAt: new Date(Date.now() - 2 * 60 * 60 * 1000), safeUntil: future(1), storageState: 'Hot-held',
    location: 'Indiranagar, Bengaluru', coordinates: { lat: 12.9784, lng: 77.6408 },
    safety: { status: 'passed', checkedAt: new Date(Date.now() - 90 * 60000), reasons: [] }, status: 'Delivered',
    pickedUpAt: new Date(Date.now() - 55 * 60000), deliveredAt: new Date(Date.now() - 20 * 60000),
  });
  const deliveredRescue = await Rescue.create({
    publicId: 'RES-DEMO-02', donation: deliveredDonation._id, activeAssignment: 'primary', status: 'delivered',
    primary: { recipient: (await Recipient.findOne({ publicId: 'NGO-DEMO-01' }))._id, driver: (await Driver.findOne({ publicId: 'DRV-DEMO-02' }))._id, score: 91 },
    failoverCount: 1, estimatedPickupAt: new Date(Date.now() - 55 * 60000), estimatedDeliveryAt: deliveredDonation.deliveredAt,
  });
  await ImpactRecord.create({ donation: deliveredDonation._id, rescue: deliveredRescue._id, quantity: 14, unit: 'kg', estimatedMeals: 56, estimatedCo2eKg: 35, backupSave: true, onTime: true, deliveredAt: deliveredDonation.deliveredAt });

  console.log('Seed complete');
  console.log('Demo users: donor@rescueloop.local, recipient@rescueloop.local, driver@rescueloop.local');
  console.log(`Donation: ${donation.publicId}`);

  await mongoose.connection.close();
}

seed().catch(async (error) => {
  console.error(error);
  await disconnectDB().catch(() => {});
  process.exit(1);
});
