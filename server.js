// server.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");

const app = express();

// ====== CONFIG ======
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "devSecretKey";

// ====== DB CONNECT ======
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/water-delivery", {
    dbName: "water-delivery",
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Mongo error:", err));

// ====== MODELS ======
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "customer", "worker"],
      default: "customer",
    },
    phone: String,
    address: String,
    loyaltyPoints: { type: Number, default: 0 },
    branch: String, // US-32 multi-branch support
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const orderSchema = new Schema(
  {
    orderCode: { type: String, unique: true, required: true },
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    customerName: String,
    customerContact: String,
    customerAddress: String,
    branch: String, // which branch serves this order (US-32)

    bottleSize: { type: String, required: true }, // e.g. 6L / 19L
    quantity: { type: Number, required: true },

    zone: String, // Zone/area for delivery charges (US-18)

    status: {
      type: String,
      enum: ["Pending", "Assigned", "OutForDelivery", "Delivered", "Cancelled"],
      default: "Pending",
    },

    assignedWorker: { type: Schema.Types.ObjectId, ref: "User" },
    assignedWorkerName: String,

    deliveryCharge: { type: Number, default: 0 },
    paymentMethod: { type: String, default: "COD" }, // COD / Easypaisa / JazzCash / BankTransfer
    paymentStatus: { type: String, default: "Unpaid" }, // Unpaid / Paid
    paymentTxnId: String, // digital payment transaction ID (US-27)

    rating: Number, // 1-5 (US-20)
    ratingComment: String,
    ratingGiven: { type: Boolean, default: false },

    returnedBottles: { type: Number, default: 0 }, // US-26
    returnReason: String,

    isSubscription: { type: Boolean, default: false }, // US-23
    subscriptionPlan: String, // weekly / monthly
    nextDeliveryDate: Date,

    loyaltyCredited: { type: Boolean, default: false }, // US-33
  },
  { timestamps: true }
);

const settingsSchema = new Schema(
  {
    isOrderingPaused: { type: Boolean, default: false },
    pauseReason: String,
    // A single settings document (we use findOne)
  },
  { timestamps: true }
);

const ticketSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: Schema.Types.ObjectId, ref: "Order" },
    category: String,
    description: String,
    photos: [String],
    status: {
      type: String,
      enum: ["Open", "InProgress", "Resolved", "Closed"],
      default: "Open",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
  },
  { timestamps: true }
);

const notificationSchema = new Schema(
  {
    audience: { type: String, default: "all" }, // all / customers / workers / admins
    title: String,
    message: String,
    sentBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const Order = mongoose.model("Order", orderSchema);
const Settings = mongoose.model("Settings", settingsSchema);
const Ticket = mongoose.model("Ticket", ticketSchema);
const Notification = mongoose.model("Notification", notificationSchema);

// ====== MIDDLEWARE ======
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function auth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, role, name }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}

// ====== HELPERS ======
function createOrderCode() {
  const now = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `ORD-${now}-${rand}`;
}

// simple tariff table for US-18
const ZONE_TARIFFS = {
  "Zone A": 50,
  "Zone B": 80,
  "Zone C": 100,
};

function computeDeliveryCharge(zone, quantity) {
  const base = ZONE_TARIFFS[zone] || 60;
  return base + quantity * 5;
}

async function getSettings() {
  let s = await Settings.findOne();
  if (!s) {
    s = await Settings.create({});
  }
  return s;
}

// ====== SEED ONE ADMIN IF NONE ======
async function seedAdmin() {
  const count = await User.countDocuments({ role: "admin" });
  if (count === 0) {
    const passwordHash = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Default Admin",
      email: "admin@demo.com",
      passwordHash,
      role: "admin",
      phone: "0300-0000000",
      address: "Head Office",
      branch: "Main Branch",
    });
    console.log("🔐 Seed admin: admin@demo.com / admin123");
  }
}
seedAdmin();

// ====== AUTH ROUTES (US-01, US-02, FR-01, FR-02) ======

// POST /api/auth/register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, phone, address, role, branch } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const userRole = ["customer", "worker"].includes(role)
      ? role
      : "customer";

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone,
      address,
      role: userRole,
      branch: branch || "Main Branch",
    });

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        branch: user.branch,
        loyaltyPoints: user.loyaltyPoints,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        branch: user.branch,
        loyaltyPoints: user.loyaltyPoints,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/auth/me
app.get("/api/auth/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    address: user.address,
    branch: user.branch,
    loyaltyPoints: user.loyaltyPoints,
  });
});

// ====== SETTINGS (US-19 Pause/Resume) ======

// GET /api/admin/settings
app.get(
  "/api/admin/settings",
  auth,
  requireRole("admin"),
  async (req, res) => {
    const s = await getSettings();
    res.json({
      isOrderingPaused: s.isOrderingPaused,
      pauseReason: s.pauseReason,
    });
  }
);

// PUT /api/admin/settings
app.put(
  "/api/admin/settings",
  auth,
  requireRole("admin"),
  async (req, res) => {
    const { isOrderingPaused, pauseReason } = req.body;
    const s = await getSettings();
    if (typeof isOrderingPaused === "boolean") {
      s.isOrderingPaused = isOrderingPaused;
    }
    if (pauseReason !== undefined) {
      s.pauseReason = pauseReason;
    }
    await s.save();
    res.json({
      message: "Settings updated",
      isOrderingPaused: s.isOrderingPaused,
      pauseReason: s.pauseReason,
    });
  }
);

// ====== CUSTOMERS CRUD (US-03, US-10, US-11) ======

// GET /api/customers?search=&role=
app.get("/api/customers", auth, requireRole("admin"), async (req, res) => {
  const { search, role } = req.query;
  const query = {};
  if (role) {
    query.role = role;
  } else {
    query.role = "customer";
  }

  if (search) {
    query.$or = [
      { name: new RegExp(search, "i") },
      { email: new RegExp(search, "i") },
      { phone: new RegExp(search, "i") },
    ];
  }

  const customers = await User.find(query).sort({ createdAt: -1 });
  res.json(customers);
});

// POST /api/customers
app.post("/api/customers", auth, requireRole("admin"), async (req, res) => {
  try {
    const { name, email, phone, address, branch } = req.body;
    if (!name || !email) {
      return res
        .status(400)
        .json({ message: "Name and email are required" });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const passwordHash = await bcrypt.hash("password123", 10); // default

    const customer = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone,
      address,
      role: "customer",
      branch: branch || "Main Branch",
    });

    res.status(201).json(customer);
  } catch (err) {
    console.error("Create customer error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/customers/:id
app.put("/api/customers/:id", auth, async (req, res) => {
  try {
    const { name, phone, address, branch } = req.body;

    // self-edit or admin-edit
    if (req.user.role !== "admin" && req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const update = {};
    if (name) update.name = name;
    if (phone) update.phone = phone;
    if (address) update.address = address;
    if (branch && req.user.role === "admin") update.branch = branch;

    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Update customer error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/customers/:id
app.delete(
  "/api/customers/:id",
  auth,
  requireRole("admin"),
  async (req, res) => {
    try {
      const result = await User.findByIdAndDelete(req.params.id);
      if (!result)
        return res.status(404).json({ message: "Customer not found" });
      res.json({ message: "Customer deleted" });
    } catch (err) {
      console.error("Delete customer error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// PUT /api/customers/:id/address – FR-10/FR-11
app.put("/api/customers/:id/address", auth, async (req, res) => {
  try {
    const { address, phone } = req.body;
    if (!address && !phone) {
      return res
        .status(400)
        .json({ message: "Address or phone required to update" });
    }

    if (req.user.role !== "admin" && req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const update = {};
    if (address) update.address = address;
    if (phone) update.phone = phone;

    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      message: "Profile updated",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        branch: user.branch,
        loyaltyPoints: user.loyaltyPoints,
      },
    });
  } catch (err) {
    console.error("Update address error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ====== ORDERS (US-04, 05, 06, 07, 08, 09, 12, 13, 17, 18, 21, 23, 24, 26, 27, 28, 33) ======

// POST /api/orders – create order (US-04, FR-04, FR-15, FR-18, FR-23)
app.post("/api/orders", auth, requireRole("customer"), async (req, res) => {
  try {
    const {
      bottleSize,
      quantity,
      address,
      paymentMethod,
      zone,
      isSubscription,
      subscriptionPlan,
    } = req.body;

    if (!bottleSize || !quantity) {
      return res
        .status(400)
        .json({ message: "Bottle size and quantity required" });
    }

    const settings = await getSettings();
    if (settings.isOrderingPaused) {
      return res.status(403).json({
        message:
          "Ordering is temporarily paused. Reason: " +
          (settings.pauseReason || "Maintenance"),
      });
    }

    const customer = await User.findById(req.user.id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    const orderCode = createOrderCode();
    const usedZone = zone || "Zone A";
    const deliveryCharge = computeDeliveryCharge(usedZone, quantity);

    const order = await Order.create({
      orderCode,
      customer: customer._id,
      customerName: customer.name,
      customerContact: customer.phone,
      customerAddress: address || customer.address,
      branch: customer.branch || "Main Branch",
      bottleSize,
      quantity,
      status: "Pending",
      paymentMethod: paymentMethod || "COD",
      paymentStatus:
        paymentMethod && paymentMethod !== "COD" ? "Unpaid" : "Unpaid",
      zone: usedZone,
      deliveryCharge,
      isSubscription: !!isSubscription,
      subscriptionPlan: subscriptionPlan || (isSubscription ? "weekly" : null),
    });

    console.log(
      `🔔 Order confirmation for customer ${customer.email}: ${order.orderCode}`
    );

    res.status(201).json({
      message: "Order created",
      order,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/orders/my – customer order history (US-08)
app.get("/api/orders/my", auth, requireRole("customer"), async (req, res) => {
  const page = parseInt(req.query.page || "1", 10);
  const pageSize = parseInt(req.query.pageSize || "10", 10);

  const query = { customer: req.user.id };

  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  res.json({
    total,
    page,
    pageSize,
    orders,
  });
});

// GET /api/orders – admin list with filters (US-03/US-05/US-07/US-09/US-24/US-28)
app.get("/api/orders", auth, requireRole("admin"), async (req, res) => {
  const { status, startDate, endDate, branch } = req.query;
  const query = {};

  if (status) query.status = status;
  if (branch) query.branch = branch;

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) {
      // inclusive end-of-day
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1);
      query.createdAt.$lt = end;
    }
  }

  const orders = await Order.find(query)
    .populate("customer", "name email phone branch")
    .populate("assignedWorker", "name email phone branch")
    .sort({ createdAt: -1 });

  res.json(orders);
});

// PUT /api/orders/:id/assign – manual assign (FR-05, FR-12)
app.put(
  "/api/orders/:id/assign",
  auth,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { workerId, mode } = req.body;

      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ message: "Order not found" });

      let worker = null;

      if (mode === "auto") {
        // simple auto assignment: pick first worker in same branch or any worker
        const branch = order.branch || "Main Branch";
        worker = await User.findOne({ role: "worker", branch });
        if (!worker) {
          worker = await User.findOne({ role: "worker" });
        }
        if (!worker) {
          return res
            .status(400)
            .json({ message: "No workers available to auto-assign" });
        }
      } else {
        if (!workerId) {
          return res.status(400).json({ message: "workerId required" });
        }
        worker = await User.findById(workerId);
        if (!worker || worker.role !== "worker") {
          return res.status(400).json({ message: "Invalid worker" });
        }
      }

      order.assignedWorker = worker._id;
      order.assignedWorkerName = worker.name;
      order.status = "Assigned";
      await order.save();

      console.log(
        `🔔 Notify worker ${worker.email}: new order ${order.orderCode} assigned`
      );

      res.json({ message: "Order assigned", order });
    } catch (err) {
      console.error("Assign order error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// GET /api/worker/orders – worker dashboard (US-06)
app.get("/api/worker/orders", auth, requireRole("worker"), async (req, res) => {
  const { status, date } = req.query;
  const query = { assignedWorker: req.user.id };

  if (status) query.status = status;
  if (date) {
    const d = new Date(date);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    query.createdAt = { $gte: d, $lt: next };
  }

  const orders = await Order.find(query)
    .populate("customer", "name phone address")
    .sort({ createdAt: -1 });
  res.json(orders);
});

// GET /api/worker/routes – optimized route list (US-13, FR-13)
app.get(
  "/api/worker/routes",
  auth,
  requireRole("worker"),
  async (req, res) => {
    const query = {
      assignedWorker: req.user.id,
      status: { $in: ["Assigned", "OutForDelivery"] },
    };
    const orders = await Order.find(query).sort({ createdAt: 1 });

    const withSeq = orders.map((o, idx) => ({
      ...o.toObject(),
      sequence: idx + 1,
      etaMinutes: 10 + idx * 7, // simple fake ETA
    }));

    res.json(withSeq);
  }
);

// PUT /api/orders/:id/status – status update (US-07)
app.put("/api/orders/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status)
      return res.status(400).json({ message: "Status is required" });

    const allowedStatuses = [
      "Pending",
      "Assigned",
      "OutForDelivery",
      "Delivered",
      "Cancelled",
    ];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id).populate(
      "customer",
      "email loyaltyPoints"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (
      req.user.role === "worker" &&
      order.assignedWorker?.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not your order" });
    }

    order.status = status;

    // loyalty points when delivered and paid (US-33)
    if (
      status === "Delivered" &&
      order.paymentStatus === "Paid" &&
      !order.loyaltyCredited
    ) {
      const pointsToAdd = order.quantity * 5; // simple rule
      const customer = await User.findById(order.customer);
      if (customer) {
        customer.loyaltyPoints += pointsToAdd;
        await customer.save();
        order.loyaltyCredited = true;
      }
    }

    await order.save();

    console.log(
      `🔔 Status changed: order ${order.orderCode} is now ${order.status}`
    );

    res.json({ message: "Status updated", order });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/orders/:id/reorder – one-click reorder (US-17)
app.post(
  "/api/orders/:id/reorder",
  auth,
  requireRole("customer"),
  async (req, res) => {
    try {
      const original = await Order.findById(req.params.id);
      if (!original || original.customer.toString() !== req.user.id) {
        return res.status(404).json({ message: "Order not found" });
      }

      const orderCode = createOrderCode();
      const newOrder = await Order.create({
        orderCode,
        customer: original.customer,
        customerName: original.customerName,
        customerContact: original.customerContact,
        customerAddress: original.customerAddress,
        branch: original.branch,
        bottleSize: original.bottleSize,
        quantity: original.quantity,
        status: "Pending",
        paymentMethod: original.paymentMethod,
        paymentStatus: "Unpaid",
        zone: original.zone,
        deliveryCharge: computeDeliveryCharge(original.zone, original.quantity),
        isSubscription: original.isSubscription,
        subscriptionPlan: original.subscriptionPlan,
      });

      res.status(201).json({ message: "Re-order created", order: newOrder });
    } catch (err) {
      console.error("Reorder error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// PUT /api/orders/:id/returns – returned/rejected bottles (US-26)
app.put(
  "/api/orders/:id/returns",
  auth,
  requireRole("admin", "worker"),
  async (req, res) => {
    try {
      const { returnedBottles, returnReason } = req.body;
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ message: "Order not found" });

      order.returnedBottles = typeof returnedBottles === "number"
        ? returnedBottles
        : order.returnedBottles;
      order.returnReason = returnReason || order.returnReason;
      await order.save();

      res.json({ message: "Return info updated", order });
    } catch (err) {
      console.error("Return update error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// POST /api/orders/:id/rate – rating & review (US-20)
app.post(
  "/api/orders/:id/rate",
  auth,
  requireRole("customer"),
  async (req, res) => {
    try {
      const { rating, comment } = req.body;
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating 1-5 required" });
      }
      const order = await Order.findById(req.params.id);
      if (!order || order.customer.toString() !== req.user.id) {
        return res.status(404).json({ message: "Order not found" });
      }
      if (order.status !== "Delivered") {
        return res
          .status(400)
          .json({ message: "Can only rate delivered orders" });
      }

      order.rating = rating;
      order.ratingComment = comment;
      order.ratingGiven = true;
      await order.save();

      res.json({ message: "Rating saved", order });
    } catch (err) {
      console.error("Rating error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// POST /api/orders/:id/pay – digital payments (US-27)
app.post("/api/orders/:id/pay", auth, async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (req.user.role === "customer") {
      if (order.customer.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not your order" });
      }
    }

    if (order.paymentStatus === "Paid") {
      return res.status(400).json({ message: "Order already paid" });
    }

    const txnId =
      "TXN-" +
      Date.now().toString(36).toUpperCase() +
      "-" +
      Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");

    order.paymentMethod = paymentMethod || order.paymentMethod;
    order.paymentStatus = "Paid";
    order.paymentTxnId = txnId;

    await order.save();

    res.json({
      message: "Payment recorded",
      transactionId: txnId,
      order,
    });
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/worker/payments – COD & pending payments view (US-21)
app.get(
  "/api/worker/payments",
  auth,
  requireRole("worker"),
  async (req, res) => {
    const query = { assignedWorker: req.user.id };
    const orders = await Order.find(query).sort({ createdAt: -1 });

    const summary = orders.map((o) => ({
      id: o._id,
      orderCode: o.orderCode,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      deliveryCharge: o.deliveryCharge,
      quantity: o.quantity,
    }));

    res.json(summary);
  }
);

// ====== ADMIN DASHBOARD SUMMARY & REPORTS (US-09, 14, 22, 24, 28) ======

// GET /api/admin/summary – dashboard cards (US-09)
app.get(
  "/api/admin/summary",
  auth,
  requireRole("admin"),
  async (req, res) => {
    const totalOrders = await Order.countDocuments({});
    const pendingOrders = await Order.countDocuments({ status: "Pending" });
    const assignedOrders = await Order.countDocuments({ status: "Assigned" });
    const outForDelivery = await Order.countDocuments({
      status: "OutForDelivery",
    });
    const deliveredOrders = await Order.countDocuments({
      status: "Delivered",
    });

    const revenueAgg = await Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: { $multiply: ["$quantity", 100] }, // simple: 100 per bottle
          },
        },
      },
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    res.json({
      totalOrders,
      pendingOrders,
      assignedOrders,
      outForDelivery,
      deliveredOrders,
      totalRevenue,
    });
  }
);

// GET /api/admin/revenue?startDate=&endDate= – revenue breakdown (US-14, 28)
app.get(
  "/api/admin/revenue",
  auth,
  requireRole("admin"),
  async (req, res) => {
    const { startDate, endDate } = req.query;
    const match = { paymentStatus: "Paid" };

    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);
        match.createdAt.$lt = end;
      }
    }

    const agg = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$paymentMethod",
          total: { $sum: { $multiply: ["$quantity", 100] } },
          count: { $sum: 1 },
        },
      },
    ]);

    const total = agg.reduce((sum, row) => sum + row.total, 0);

    res.json({
      totalRevenue: total,
      byMethod: agg.map((row) => ({
        method: row._id,
        total: row.total,
        count: row.count,
      })),
    });
  }
);

// GET /api/admin/loyalty – frequency & tiers (US-24, 33)
app.get(
  "/api/admin/loyalty",
  auth,
  requireRole("admin"),
  async (req, res) => {
    const agg = await Order.aggregate([
      {
        $group: {
          _id: "$customer",
          orderCount: { $sum: 1 },
        },
      },
    ]);

    const ids = agg.map((a) => a._id);
    const users = await User.find({ _id: { $in: ids } });

    const result = agg.map((a) => {
      const user = users.find((u) => u._id.toString() === a._id.toString());
      let tier = "Bronze";
      if (a.orderCount >= 10) tier = "Gold";
      else if (a.orderCount >= 5) tier = "Silver";
      return {
        customerId: a._id,
        name: user ? user.name : "Unknown",
        email: user ? user.email : "",
        orderCount: a.orderCount,
        tier,
        loyaltyPoints: user ? user.loyaltyPoints : 0,
      };
    });

    res.json(result);
  }
);

// GET /api/admin/pending-alerts – long pending orders (US-22)
app.get(
  "/api/admin/pending-alerts",
  auth,
  requireRole("admin"),
  async (req, res) => {
    const thresholdHours = parseFloat(req.query.hours || "2");
    const cutoff = new Date(Date.now() - thresholdHours * 60 * 60 * 1000);

    const orders = await Order.find({
      status: { $in: ["Pending", "Assigned"] },
      createdAt: { $lt: cutoff },
    }).sort({ createdAt: 1 });

    res.json(orders);
  }
);

// ====== ISSUES / DAMAGE REPORTING (US-31) ======

// POST /api/issues – customer report
app.post("/api/issues", auth, requireRole("customer"), async (req, res) => {
  try {
    const { orderId, category, description } = req.body;
    if (!description) {
      return res.status(400).json({ message: "Description required" });
    }
    const ticket = await Ticket.create({
      customer: req.user.id,
      order: orderId || null,
      category,
      description,
      priority: "Medium",
    });
    res.status(201).json({ message: "Issue reported", ticket });
  } catch (err) {
    console.error("Issue create error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/issues – admin view
app.get("/api/issues", auth, requireRole("admin"), async (req, res) => {
  const tickets = await Ticket.find({})
    .populate("customer", "name email")
    .populate("order", "orderCode status")
    .sort({ createdAt: -1 });
  res.json(tickets);
});

// ====== PROMOTIONAL NOTIFICATIONS (US-30) ======

// POST /api/admin/notifications – create campaign
app.post(
  "/api/admin/notifications",
  auth,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { audience, title, message } = req.body;
      if (!title || !message) {
        return res.status(400).json({ message: "Title & message required" });
      }
      const n = await Notification.create({
        audience: audience || "customers",
        title,
        message,
        sentBy: req.user.id,
      });
      console.log(
        `📣 Promotion sent to ${n.audience}: ${n.title} – ${n.message}`
      );
      res.status(201).json({ message: "Campaign created", notification: n });
    } catch (err) {
      console.error("Notification error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// GET /api/notifications – user view (simple, in-app)
app.get("/api/notifications", auth, async (req, res) => {
  const role = req.user.role;
  let audienceFilter = ["all"];
  if (role === "admin") audienceFilter.push("admins");
  if (role === "customer") audienceFilter.push("customers");
  if (role === "worker") audienceFilter.push("workers");

  const notes = await Notification.find({ audience: { $in: audienceFilter } })
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(notes);
});

// ====== CATCH-ALL: SERVE FRONTEND ======
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ====== START SERVER ======
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
