const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please tell us your name"],
        minLength:3,
        maxLength:20
    },
   
    email:{
        type:String,
        required:[true,"Please provide an email"],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'please provide a valid email']

    },
    photo: {
      type:  String,
      default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0fJFTSSoMia3RIhygxt6Ac-MI68maxxU8d2i6jF1cRZ6sSgBwjkVNhzrWxQ&s"
    },
    password:{
        type:String,
        require:[true,"user must have password"],
        minLength:8,
        
    },
   
    passwordConfirm:{
        type:String,
        require:[true,"user must have password"],    
        validate:{
            validator:function(el){
               return el ===this.password;
            },
            message:"passwords are not the same!"
        }
    },
    passwordChangedAt:Date,

    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },

},{
    timestamps:true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

//call back function implement before saving 
userSchema.pre('save', async function(next){
    //1) if password not modified move to next middleware
    if(!this.isModified('password')) return next();
    //2)else hashing  password
    this.password = await bcrypt.hash(this.password,10);
    //3)make passwordConfirm  not saved in db
    this.passwordConfirm=undefined;

    next()
});

userSchema. pre('save', async function(next){
    if(!this.isModified('password')||this.isNew) return next();
    this.passwordChangedAt = Date.now() -1000;
    next()
});

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
  
      return JWTTimestamp < changedTimestamp;
    }
  
    // False means NOT changed
    return false;
  };

//schema method to compare passwords
userSchema.methods.correctPassword = async(candidatePassword, userPassword)=>{
    return await bcrypt.compare(candidatePassword,userPassword);
}

const User = mongoose.model('User',userSchema);

module.exports = User