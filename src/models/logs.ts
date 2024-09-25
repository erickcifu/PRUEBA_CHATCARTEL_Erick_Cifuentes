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




