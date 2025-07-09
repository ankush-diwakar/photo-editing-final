const bcrypt = require('bcryptjs'); // used to hash/encrypt the password
const prisma = require('../../prisma');
const jwt = require('jsonwebtoken');

const authController = { // user Authentication Controller 
  signup: async (req, res) => {
    // console.log(req.body);
    try {
      const { email, password, username } = req.body;
      if (password.lenght < 6) {
        res.status(401).json({ "message": "Password should be greater than 6 characters" });
      }
      const hashed_password = bcrypt.hashSync(password, 10);

      const admin = await prisma.admin.create({
        data: {
          email: email,
          username: username,
          password: hashed_password,
        }
      });

      res.status(200).json({ "message": "succesfully signed up" });
    } catch (error) {
      res.status(500).json({ "error": error })
      console.log(error);
    }
  },

  signin: async (req, res) => {
    try {
      const { email, password } = req.body
      // console.log(req.body);
      const user = await prisma.admin.findUnique({
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
        role: "admin"
      }

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

      res.status(201).json({ "Message": "User Loged in Succesfully!!", user, "token": "Bearer " + token });
    } catch (error) {
      res.status(500).json({ "error": error });
      console.log(error);
    }
  },
  create: async (req, res) => {
    try {
      const { username, email, password, role } = req.body;
      const adminRole = req.user.role;
      if (adminRole != 'SUPER_ADMIN') return res.status(403).json({ "message": "You don't have privilages to create admin" })
      // Validate input
      if (!username || !email || !password) {
        return res.status(400).json({ "message": "Username, email, and password are required" });
      }

      // Validate role
      const validRoles = ['EDITOR', 'MANAGER', 'SUPER_ADMIN']; // Add all your AdminRole enum values here
      if (role && !validRoles.includes(role)) {
        return res.status(400).json({ "message": "Invalid role specified" });
      }

      // Check if username or email already exists
      const existingAdmin = await prisma.admin.findFirst({
        where: {
          OR: [
            { username: username },
            { email: email }
          ]
        }
      });

      if (existingAdmin) {
        return res.status(400).json({ "message": "Username or email already exists" });
      }

      // Hash password
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Create new admin
      const newAdmin = await prisma.admin.create({
        data: {
          username,
          email,
          password: hashedPassword,
          role: role || undefined, // If role is not provided, it will default to EDITOR
        }
      });

      // Remove password from response
      const { password: _, ...adminWithoutPassword } = newAdmin;

      res.status(201).json({
        "message": "Admin created successfully",
        "admin": adminWithoutPassword
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ "error": "Internal server error" });
    }
  },
}

const fetchController = {
  getAllEditors: async (req, res) => {
    try {
      const { role } = req.query;
      const editors = await prisma.admin.findMany({
        where: {
          role: role
        }
      });
      if (!editors) return res.status(404).json({ "message": "No editors found" });
      res.status(201).json({ "Message": "Editors fouded", editors });
    } catch (error) {
      handlePrismaError(error, res)
    }

  },
  getAdmins: async (req, res) => {
    try {
      const admins = await prisma.admin.findMany({});
      if (!admins) return res.status(404).json({ "message": "Not found" });
      res.status(201).json({ "message": "Successful", admins })
    } catch (error) {
      handlePrismaError(error, res);
    }
  },
  deleteAdmin: async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.admin.delete({
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
        return res.status(409).json({ message: "A unique constraint would be violated on Payment. Details: " + error.meta.target });
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

module.exports = { authController, fetchController }  