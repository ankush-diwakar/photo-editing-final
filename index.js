const express = require('express');
const passport = require('passport');
const cors = require('cors');
const path = require('path');
require('./src/passport');

const userRoutes = require('./src/routes/client/userRoutes')
const adminRoutes = require('./src/routes/admin/adminRoutes')
const serviceRoutes = require('./src/routes/service/serviceRoutes');
const subServiceRoutes = require('./src/routes/service/subServicesRoutes');
const utilitis = require("./utilitis/dropbox");
const jobRoutes = require('./src/routes/service/jobRoutes');
const paymentRoutes = require('./src/routes/service/paymentRoutes');
const imageRoutes = require('./src/routes/service/imageRoutes');
const gallaryRouter = require('./src/routes/gallary/gallaryRouter')
const dropboxRouter = require('./utilitis/dropbox')
const gallayRouter = require("./src/routes/contact/contactRoute");
const testimonialsRoutes = require("./src/routes/testimonials/testimonials");
const pricesRoutes2 = require("./src/routes/prices/price");
const jobOpeningRoutes = require("./src/routes/jobOpenings/jobOpenings")
const freeTrialLeadsRoutes = require("./src/routes/freeTrial/freeTrialLeads")
const applicationRoutes = require('./src/routes/jobapplications/applicationRoutes');
const serviceImageRouter = require('./src/routes/caraousal/serviceImageRouter');

const app = express();
app.use(cors())

app.use(express.json());
app.use(cors());
app.use(passport.initialize());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use('/images', express.static(path.join(__dirname, 'uploads/images')));
app.use('/uploads/applications', express.static(path.join(__dirname, 'uploads/applications/')));
app.use('/uploads/service-images', express.static(path.join(__dirname, 'uploads/service-images')));

app.use("/api/users",userRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/services",serviceRoutes);
app.use("/api/subServices",subServiceRoutes);
// app.use("/api/prices",priceRoutes);
app.use("/api",utilitis);
app.use('/api/jobs', jobRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api',imageRoutes)
app.use('/api', dropboxRouter); 
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/gallary',gallaryRouter);
app.use('/api/contact',gallayRouter);
app.use('/api/pricing',pricesRoutes2);
app.use('/api/job-openings',jobOpeningRoutes);
app.use('/api/free-trial-leads',freeTrialLeadsRoutes);
app.use('/api/carousal',serviceImageRouter);
app.use('/api',applicationRoutes);

app.use(express.static(path.join(__dirname, 'build')));

// app.get('', (req, res) => {
//     res.sendFile(path.join(__dirname+'/build/index.html'));
//   });

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
  
app.listen(8080,'0.0.0.0',()=>{
    console.log("[Server]:-http://localhost:8080")
})