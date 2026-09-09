require('dotenv').config();
//console.log('JWT SECRET:', process.env.JWT_SECRET); // TEMPORARY DEBUG LINE

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const dealRoutes = require('./routes/dealRoutes');

const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const aiRoutes = require('./routes/aiRoutes');

// DB connect
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send('AI CRM Backend is running 🚀');
});

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/deals', dealRoutes);
// aage yahan deal, task, ai routes bhi add honge:
// app.use('/api/ai', aiRoutes);

app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));