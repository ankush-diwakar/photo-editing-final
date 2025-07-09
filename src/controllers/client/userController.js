const bcrypt = require('bcryptjs'); // used to hash/encrypt the password
const prisma = require('../../prisma');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'bhushanpawar9001@gmail.com',
    pass: 'eqctgnrfsoooxavb'
  }
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


const authController = { // user Authentication Controller 
  signup: async (req, res) => {
    // console.log(req.body);
    try {
      const { email, password, username } = req.body;
      if (password.lenght < 6) {
        res.status(401).json({ "message": "Password should be greater than 6 characters" });
      }
      const hashed_password = bcrypt.hashSync(password, 10);
      const otp = generateOTP();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      const user = await prisma.client.create({
        data: {
          email: email,
          username: username,
          password: hashed_password,
          otp: {
            create: {
              otp: otp,
              expiresAt: otpExpires
            }
          }
        }
      });
      await transporter.sendMail({
        to: email,
        subject: 'Email Verification OTP',
        text: `Your OTP for email verification is: ${otp}. It will expire in 10 minutes.`
      });
      res.status(200).json({ "message": "Check your mail" });
    } catch (error) {
      res.status(500).json({ "error": error })
      console.log(error);
    }
  },

  verifyEmail: async (req, res) => {
    try {
      const { email, otp } = req.body;
      const user = await prisma.client.findUnique({
        where: { email },
        include: { otp: true }
      });

      if (!user) {
        return res.status(400).json({ "message": "User not found" });
      }

      const validOTP = user.otp.find(
        otpRecord => otpRecord.otp === otp && otpRecord.expiresAt > new Date()
      );

      if (!validOTP) {
        return res.status(400).json({ "message": "Invalid or expired OTP" });
      }

      await prisma.client.update({
        where: { id: user.id },
        data: { isVerified: true }
      });

      await prisma.oTP.deleteMany({
        where: { clientId: user.id }
      });

      res.status(200).json({ "message": "Email verified successfully. You can now log in." });
    } catch (error) {
      res.status(500).json({ "error": error.message });
      console.log(error);
    }
  },
  signin: async (req, res) => {
    try {
      const { email, password } = req.body
      console.log(req.body);
      const user = await prisma.client.findUnique({
        where: {
          email
        }
      })
      //   console.log(user);
      if (!user) return res.status(401).json({ "error": "No user with this email" })
      if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ "error": "Incorrect Password" });


      const payload = {
        email: email,
        id: user.id,
        role:"client"
      }

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

      res.status(201).json({ "Message": "User Loged in Succesfully!!", user, "token": "Bearer " + token });
    } catch (error) {
      res.status(500).json({ "error": error });
      console.log(error);
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { email } = req.body
      const user = await prisma.client.findUnique({
        where: {
          email: email
        }
      })
      if (!user) return res.status(400).json({ "message": "No user with this email" });
      const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10m' });

      const resetUrl = `http://your-frontend-domain/reset-password?token=${resetToken}`;
      await transporter.sendMail({
        to: email,
        subject: 'Password Reset Request',
        text: `You requested a password reset. Please use the following link: ${resetUrl}. This link will expire in 10 minutes.`
      });

      res.status(200).json({ "message": "Password reset email sent",resetToken });
    } catch (error) {
      res.status(500).json({ "error": error });
      console.log(error);
    }
  },
  resetPasswordconfirm: async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.client.findUnique({
        where: {
          email: decode.email
        }
      })
      console.log(user)
      if (!user) return res.status(400).json({ "message": "Invalid token" });
      const hashedPassword = bcrypt.hashSync(newPassword, 10);

      await prisma.client.update({
        where: { id: user.id },
        data: {
          password: hashedPassword
        }
      });

      res.status(200).json({ "message": "Password reset successfully" });
    } catch (error) {

    }
  }
}

const fetchController = {
  getAllUsers : async (req,res) => {
    try {
        const users = await prisma.client.findMany({});
        if(users.length == 0)return res.status(404).json({"message":"users not found"});
        res.status(201).json({"message":"users Found",users});
    } catch (error) {
      handlePrismaError(error,res)
    }
  },
  deleteUser:async (req,res) => {
    try {
      const { id } = req.params;
      await prisma.client.delete({
        where:{id:Number(id)}
      }).then(()=>{res.status(201).json({"message":"Deleted Succesfully"})
      })
    } catch (error) {
      handlePrismaError(error, res)
    }
  }
}
function handlePrismaError(error, res) {
  console.error(error);
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
          case 'P2002':
              return res.status(409).json({ message: "A unique constraint would be violated on Job. Details: " + error.meta.target });
          case 'P2025':
              return res.status(404).json({ message: "Record not found" });
          case 'P2003':
              return res.status(400).json({ message: "Foreign key constraint failed on the field: " + error.meta.field_name });
          default:
              return res.status(400).json({ message: "Database error", error: error.message });
      }
  } else if (error instanceof Prisma.PrismaClientValidationError) {
      return res.status(400).json({ message: "Validation error", error: error.message });
  } else {
      return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

module.exports = { authController,fetchController}
