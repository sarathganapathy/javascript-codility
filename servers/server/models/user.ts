import { Model, model, Schema } from "mongoose";
import * as uniqueValidator from "mongoose-unique-validator";
import * as bcrypt from "bcrypt";
import { UserDocument } from "../types/user";
import { DefaultValues } from "../types/util";
// schema for user
const userSchema: Schema = new Schema(
  {
    firstName: { type: String, required: [true, "First name can't be blank"] },
    lastName: { type: String, required: false },
    username: {
      type: String, lowercase: true, unique: true, required: [true, "Username can't be blank"]
    },
    phoneNo: {
      type: String,
      unique: true,
      sparse: true,
      maxlength: [15, "Phone number should be less than 15 characters"]
    },
    email: {
      type: String, unique: true, lowercase: true, required: [true, "Email can't be blank"], match: [/\S+@\S+\.\S+/, 'Invalid email']
    },
    hasEmailVerified: { type: Boolean, default: false },
    role: { type: String, enum: ["User", "Manager", "Admin"], default: "User" },
    activeStatus: { type: Boolean, default: false },
    password: { type: String, required: [true, "Password can't be blank"] }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

userSchema.plugin(uniqueValidator, { message: 'Already exists.' });

// pre function for hashing the password while creating
userSchema.pre<UserDocument>('save', async function (next: any) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  // hash the password using our new salt
  try {
    const salt = await bcrypt.genSalt(DefaultValues.BycryptRounds);
    // override the cleartext password with the hashed one
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// pre function for hashing the password while updating
userSchema.pre('findOneAndUpdate', async function (next: any) {
  const password = this.getUpdate().$set.password;
  if (!password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    this.getUpdate().$set.password = hash;
    next();
  } catch (error) {
    return next(error);
  }
});

// mongoose method for comparing password
userSchema.methods.comparePassword = async function (password: string) {
  // Hashes the password sent by the user for login and checks if the hashed password stored in the database
  // matches the one sent. Returns true if it does else false.
  return bcrypt.compare(password, this.password);
};

const User: Model<UserDocument> = model<UserDocument>('User', userSchema);
export default User;