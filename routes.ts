import express from 'express';
import ParkingLot from './models/parkingLot';
import moment from 'moment';
const router = express.Router();

router.post('/add-parking-lot', async (req, res) => {
  const { email, size } = req.body;
  const lotAlreadyExist = await ParkingLot.findOne({ email });
  if (lotAlreadyExist) {
    return res.json({
      success: false,
      msg: 'Lot Already exist with this manager Email.',
    });
  }
  const parkingLot = new ParkingLot({
    email,
    size,
    slots: new Array(size).fill(true),
  });

  await parkingLot.save();
  return res.json({
    success: true,
    msg: `Allocation of new a parking lot with a size of ${size} is successfully`,
  });
});

router.post('/park', async (req, res) => {
  const { email, managerEmail } = req.body;
  const parkingLot = await ParkingLot.findOne({ email: managerEmail });
  if (parkingLot) {
    let currentSlot = 0;
    for (const slot of parkingLot.slots) {
      if (slot === true) {
        parkingLot.slots[currentSlot] = {
          email,
          startTime: moment.utc().toDate(),
        };
        break;
      }
      currentSlot += 1;
    }
    parkingLot.markModified('slots');
    await parkingLot.save();
    return res.json({
      success: true,
      msg: `Slot ${currentSlot + 1} successfully occupied.`,
    });
  }
  return res.json({
    success: false,
    msg: `No parking slot found with that manager email.`,
  });
});
router.post('/unpark', async (req, res) => {
  const { email, managerEmail, slot: slotNumber } = req.body;
  const parkingLot = await ParkingLot.findOne({ email: managerEmail });
  if (parkingLot) {
    let charged = 0;
    let currentSlot = 0;
    for (const slot of parkingLot.slots) {
      if (slot?.email === email && currentSlot + 1 === slotNumber) {
        const diffInHours = moment.utc().diff(slot.startTime, 'seconds') / 3600;
        charged = 10 * Math.ceil(diffInHours);
        parkingLot.slots[currentSlot] = true;
        break;
      }
      currentSlot += 1;
    }
    if (charged !== 0) {
      parkingLot.markModified('slots');
      await parkingLot.save();
      return res.json({
        charged,
        success: true,
        msg: `Successfully Unparked`,
      });
    }
    return res.json({
      success: false,
      msg: `Parking slot ${slotNumber} invalid slot number.`,
    });
  }
  return res.json({
    success: false,
    msg: `No parking slot found with that manager email.`,
  });
});
router.post('/slot-toggle', async (req, res) => {
  const { managerEmail, slot: slotNumber } = req.body;
  const parkingLot = await ParkingLot.findOne({ email: managerEmail });
  if (parkingLot) {
    let currentSlot = 0;
    let slotToggled = false;
    for (const slot of parkingLot.slots) {
      if (!slot?.email && currentSlot + 1 === slotNumber) {
        parkingLot.slots[currentSlot] = !slot;
        slotToggled = true;
        break;
      }
      currentSlot += 1;
    }
    if (slotToggled) {
      parkingLot.markModified('slots');
      await parkingLot.save();
      return res.json({
        success: true,
        msg: `Parking slot ${currentSlot + 1} is currently in ${
          parkingLot.slots[currentSlot] ? 'working' : 'maintenance'
        } state`,
      });
    }
    return res.json({
      success: false,
      msg: `Parking slot ${slotNumber} invalid slot number or slot already occupied.`,
    });
  }
  return res.json({
    success: false,
    msg: `No parking slot found with that manager email.`,
  });
});
export default router;
