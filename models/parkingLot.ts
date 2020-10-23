import Mongoose from 'mongoose';
interface IParkingLot {
  email: string;
  isManager: boolean;
  size: boolean;
  slots: any[];
}
type IParkingLotModel = Mongoose.Document & IParkingLot;
const ParkingLotSchema = new Mongoose.Schema<IParkingLotModel>(
  {
    email: { type: Mongoose.Schema.Types.String },
    isManager: { type: Mongoose.Schema.Types.String, default: false },
    size: { type: Mongoose.Schema.Types.Number },
    slots: { type: Mongoose.Schema.Types.Array, default: [] },
  },

  { timestamps: true }
);

export const ParkingLot = Mongoose.model<IParkingLotModel>(
  'parkingLot',
  ParkingLotSchema
);

export default ParkingLot;
