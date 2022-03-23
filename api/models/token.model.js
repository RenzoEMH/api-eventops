import mongoose from 'mongoose';

const { Schema } = mongoose;

const tokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'users',
      unique: true,
    },
    token: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Token = mongoose.model('Tokens', tokenSchema, 'tokens');

export default Token;
