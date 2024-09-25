import mongoose, { Schema, Document } from 'mongoose';

interface Log extends Document {
  userId: number;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  resource: 'USER' | 'PROJECT' | 'TASK',
  timestamp: Date;
}

const logSchema = new Schema<Log>({
  userId: { type: Number, required: true },
  action: { type: String, enum: ['CREATE', 'UPDATE', 'DELETE'], required: true },
  resource: { type: String, enum: ['USER' , 'PROJECT' , 'TASK'], required: true },
  timestamp: { type: Date, default: Date.now },
});

const LogModel = mongoose.model<Log>('Log', logSchema);

export default LogModel;



// import mongoose from 'mongoose';

// const logSchema = new mongoose.Schema({
//   action: { type: String, enum: ['CREATE', 'UPDATE', 'DELETE'], required: true },
//   resource: { type: String, enum: ['USER', 'PROJECT', 'TASK'], required: true },
//   timestamp: { type: Date, default: Date.now },
// });

// const Log = mongoose.model('Log', logSchema);

// export default Log;

