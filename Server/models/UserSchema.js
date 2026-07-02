const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ['renter', 'owner', 'admin'], default: 'renter' },
  profileImage: { type: String, default: '' },
  currentLocation: { type: String, default: '' },
  isApproved: { 
    type: Boolean, 
    default: function() {
      // Admin and renters are auto-approved, owners require admin approval
      return this.userType !== 'owner';
    }
  }
}, { timestamps: true });

UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
