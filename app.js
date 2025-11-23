// public/app.js

const API_BASE = "";

// Simple state
let authToken = null;
let currentUser = null;

// DOM helpers
const $ = (id) => document.getElementById(id);
const toastEl = $("toast");

function showToast(message, type = "success") {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.remove("hidden", "success", "error");
  toastEl.classList.add(type === "error" ? "error" : "success");
  setTimeout(() => {
    toastEl.classList.add("hidden");
  }, 3200);
}

function authHeaders() {
  return authToken
    ? {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      }
    : { "Content-Type": "application/json" };
}

function setLoggedIn(user, token) {
  currentUser = user;
  authToken = token;
  localStorage.setItem(
    "hydrotrack_auth",
    JSON.stringify({ token, user: currentUser })
  );

  $("auth-section").classList.add("hidden");
  $("dashboard-section").classList.remove("hidden");
  $("nav-login").classList.add("hidden");
  $("nav-register").classList.add("hidden");
  $("nav-dashboard").classList.remove("hidden");
  $("nav-logout").classList.remove("hidden");

  $("dashboard-title").textContent = `Welcome, ${user.name}`;
  $("dashboard-subtitle").textContent = `Role: ${
    user.role.charAt(0).toUpperCase() + user.role.slice(1)
  }`;
  initRolePanels();
}

function setLoggedOut() {
  currentUser = null;
  authToken = null;
  localStorage.removeItem("hydrotrack_auth");

  $("auth-section").classList.remove("hidden");
  $("dashboard-section").classList.add("hidden");
  $("nav-login").classList.remove("hidden");
  $("nav-register").classList.remove("hidden");
  $("nav-dashboard").classList.add("hidden");
  $("nav-logout").classList.add("hidden");
}

// Restore session
(function bootstrap() {
  try {
    const data = JSON.parse(localStorage.getItem("hydrotrack_auth"));
    if (data && data.token && data.user) {
      authToken = data.token;
      currentUser = data.user;
      $("auth-section").classList.add("hidden");
      $("dashboard-section").classList.remove("hidden");
      $("nav-login").classList.add("hidden");
      $("nav-register").classList.add("hidden");
      $("nav-dashboard").classList.remove("hidden");
      $("nav-logout").classList.remove("hidden");
      $("dashboard-title").textContent = `Welcome, ${currentUser.name}`;
      $("dashboard-subtitle").textContent = `Role: ${
        currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)
      }`;
      initRolePanels();
    }
  } catch (err) {
    console.warn("Session restore failed", err);
  }
})();

// Tabs for auth
$("tab-login").addEventListener("click", () => {
  $("tab-login").classList.add("active");
  $("tab-register").classList.remove("active");
  $("login-form").classList.add("active");
  $("register-form").classList.remove("active");
});

$("tab-register").addEventListener("click", () => {
  $("tab-register").classList.add("active");
  $("tab-login").classList.remove("active");
  $("register-form").classList.add("active");
  $("login-form").classList.remove("active");
});

// Nav buttons
$("nav-login").addEventListener("click", () => {
  $("auth-section").scrollIntoView({ behavior: "smooth" });
});

$("nav-register").addEventListener("click", () => {
  $("auth-section").scrollIntoView({ behavior: "smooth" });
  $("tab-register").click();
});

$("nav-dashboard").addEventListener("click", () => {
  $("dashboard-section").scrollIntoView({ behavior: "smooth" });
});

$("nav-logout").addEventListener("click", () => {
  setLoggedOut();
});

// ====== AUTH FORMS ======
$("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const email = form.email.value.trim();
  const password = form.password.value;

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.message || "Login failed", "error");
      return;
    }
    showToast("Login successful");
    setLoggedIn(data.user, data.token);
  } catch (err) {
    console.error(err);
    showToast("Network error", "error");
  }
});

$("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    password: form.password.value,
    phone: form.phone.value.trim(),
    address: form.address.value.trim(),
    role: form.role.value,
  };

  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.message || "Registration failed", "error");
      return;
    }
    showToast("Account created & logged in");
    setLoggedIn(data.user, data.token);
  } catch (err) {
    console.error(err);
    showToast("Network error", "error");
  }
});

// ====== ROLE PANELS ======

function initRolePanels() {
  // Show role tabs if admin can jump between views easily
  const roleTabs = $("role-tabs");
  roleTabs.classList.remove("hidden");
  document.querySelectorAll(".role-panel").forEach((p) => {
    p.classList.add("hidden");
  });

  if (!currentUser) return;

  // Switch active tab based on role
  document.querySelectorAll(".role-tab").forEach((btn) => {
    btn.classList.remove("active");
  });

  if (currentUser.role === "customer") {
    $("customer-panel").classList.remove("hidden");
    document
      .querySelector('[data-panel="customer-panel"]')
      .classList.add("active");
    loadCustomerProfile();
    loadNotifications();
    loadOrderHistory();
    loadSettingsBanner();
  } else if (currentUser.role === "admin") {
    $("admin-panel").classList.remove("hidden");
    document
      .querySelector('[data-panel="admin-panel"]')
      .classList.add("active");
    loadAdminSummary();
    loadCustomers();
    loadWorkers();
    loadSettingsBanner();
  } else if (currentUser.role === "worker") {
    $("worker-panel").classList.remove("hidden");
    document
      .querySelector('[data-panel="worker-panel"]')
      .classList.add("active");
    loadWorkerOrders();
    loadWorkerRoutes();
    loadWorkerPayments();
    loadSettingsBanner();
  }

  // Role tab clicks
  document.querySelectorAll(".role-tab").forEach((btn) => {
    btn.onclick = () => {
      document.querySelectorAll(".role-tab").forEach((b) => {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      document.querySelectorAll(".role-panel").forEach((p) => {
        p.classList.add("hidden");
      });
      const panelId = btn.dataset.panel;
      $(panelId).classList.remove("hidden");
    };
  });
}

// ====== SETTINGS & BANNERS (US-19, US-22) ======
async function loadSettingsBanner() {
  try {
    const res = await fetch(`${API_BASE}/api/admin/settings`, {
      headers: authHeaders(),
    });
    if (!res.ok) return;
    const data = await res.json();
    const banner = $("pause-banner");
    if (data.isOrderingPaused) {
      banner.textContent =
        "Ordering is temporarily paused: " +
        (data.pauseReason || "Maintenance / holiday");
      banner.classList.remove("hidden");
    } else {
      banner.classList.add("hidden");
    }

    // Pre-fill settings form if admin
    if (currentUser.role === "admin") {
      const form = $("settings-form");
      form.isOrderingPaused.checked = data.isOrderingPaused;
      form.pauseReason.value = data.pauseReason || "";
    }
  } catch (err) {
    console.error("Settings banner error", err);
  }
}

// Admin: update settings
if ($("settings-form")) {
  $("settings-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    try {
      const res = await fetch(`${API_BASE}/api/admin/settings`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({
          isOrderingPaused: form.isOrderingPaused.checked,
          pauseReason: form.pauseReason.value.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Settings update failed", "error");
        return;
      }
      showToast("Settings updated");
      loadSettingsBanner();
    } catch (err) {
      console.error(err);
      showToast("Network error", "error");
    }
  });
}

// Admin: pending alerts
if ($("load-alerts")) {
  $("load-alerts").addEventListener("click", async () => {
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/pending-alerts?hours=2`,
        {
          headers: authHeaders(),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Could not load alerts", "error");
        return;
      }
      const banner = $("alerts-banner");
      if (data.length === 0) {
        banner.textContent = "No long-pending orders. 🎉";
        banner.classList.remove("hidden");
      } else {
        banner.textContent = `⚠️ ${data.length} orders are pending for more than 2 hours. Please review.`;
        banner.classList.remove("hidden");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error", "error");
    }
  });
}

// ====== CUSTOMER PANEL ======

async function loadCustomerProfile() {
  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: authHeaders(),
    });
    const data = await res.json();
    if (!res.ok) return;
    currentUser = data;
    const form = $("profile-form");
    form.name.value = data.name || "";
    form.email.value = data.email || "";
    form.phone.value = data.phone || "";
    form.address.value = data.address || "";
    form.loyaltyPoints.value = data.loyaltyPoints ?? 0;
  } catch (err) {
    console.error(err);
  }
}

if ($("profile-form")) {
  $("profile-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    try {
      const res = await fetch(
        `${API_BASE}/api/customers/${currentUser.id || currentUser._id}/address`,
        {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify({
            phone: form.phone.value.trim(),
            address: form.address.value.trim(),
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Failed to update profile", "error");
        return;
      }
      showToast("Contact updated");
      currentUser = data.user;
      form.loyaltyPoints.value = currentUser.loyaltyPoints ?? 0;
    } catch (err) {
      console.error(err);
      showToast("Network error", "error");
    }
  });
}

// Place order
if ($("place-order-form")) {
  $("place-order-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      bottleSize: form.bottleSize.value,
      quantity: Number(form.quantity.value),
      address: form.address.value.trim() || undefined,
      zone: form.zone.value,
      paymentMethod: form.paymentMethod.value,
      isSubscription: form.isSubscription.checked,
      subscriptionPlan: form.subscriptionPlan.value || undefined,
    };
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Order failed", "error");
        return;
      }
      showToast("Order placed. Confirmation generated.");
      form.reset();
      loadOrderHistory();
    } catch (err) {
      console.error(err);
      showToast("Network error", "error");
    }
  });
}

// Notifications
async function loadNotifications() {
  try {
    const res = await fetch(`${API_BASE}/api/notifications`, {
      headers: authHeaders(),
    });
    const data = await res.json();
    if (!res.ok) return;
    const list = $("notifications-list");
    list.innerHTML = "";
    data.forEach((n) => {
      const li = document.createElement("li");
      li.textContent = `${new Date(n.createdAt).toLocaleString()} – ${
        n.title
      }: ${n.message}`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error(err);
  }
}

// Order history
async function loadOrderHistory() {
  try {
    const res = await fetch(`${API_BASE}/api/orders/my?page=1&pageSize=20`, {
      headers: authHeaders(),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.message || "Unable to load history", "error");
      return;
    }
    const tbody = $("history-table").querySelector("tbody");
    tbody.innerHTML = "";
    data.orders.forEach((o) => {
      const tr = document.createElement("tr");
      const dateStr = new Date(o.createdAt).toLocaleString();
      const paymentStr = `${o.paymentMethod || "COD"} / ${
        o.paymentStatus || "Unpaid"
      }`;
      const actions = [];

      // Reorder
      actions.push(
        `<button data-order-reorder="${o._id}" class="btn tiny secondary">Re-order</button>`
      );

      // Rate if delivered and not rated
      if (o.status === "Delivered" && !o.ratingGiven) {
        actions.push(
          `<button data-order-rate="${o._id}" class="btn tiny">Rate</button>`
        );
      }

      // Pay if digital method and unpaid
      if (
        ["Easypaisa", "JazzCash", "BankTransfer"].includes(
          o.paymentMethod || ""
        ) &&
        o.paymentStatus !== "Paid"
      ) {
        actions.push(
          `<button data-order-pay="${o._id}" class="btn tiny">Pay now</button>`
        );
      }

      tr.innerHTML = `
        <td>${o.orderCode}</td>
        <td>${dateStr}</td>
        <td>${o.bottleSize}</td>
        <td>${o.quantity}</td>
        <td>${o.status}</td>
        <td>${paymentStr}</td>
        <td>${actions.join(" ")}</td>
      `;
      tbody.appendChild(tr);
    });

    // Attach action handlers
    tbody.querySelectorAll("[data-order-reorder]").forEach((btn) => {
      btn.onclick = () => handleReorder(btn.dataset.orderReorder);
    });
    tbody.querySelectorAll("[data-order-rate]").forEach((btn) => {
      btn.onclick = () => handleRateOrder(btn.dataset.orderRate);
    });
    tbody.querySelectorAll("[data-order-pay]").forEach((btn) => {
      btn.onclick = () => handlePayOrder(btn.dataset.orderPay);
    });
  } catch (err) {
    console.error(err);
  }
}

if ($("refresh-history")) {
  $("refresh-history").addEventListener("click", loadOrderHistory);
}

// Reorder
async function handleReorder(orderId) {
  if (!confirm("Recreate this order?")) return;
  try {
    const res = await fetch(`${API_BASE}/api/orders/${orderId}/reorder`, {
      method: "POST",
      headers: authHeaders(),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.message || "Failed to re-order", "error");
      return;
    }
    showToast("Re-order created");
    loadOrderHistory();
  } catch (err) {
    console.error(err);
    showToast("Network error", "error");
  }
}

// Rating
async function handleRateOrder(orderId) {
  const ratingStr = prompt("Rate delivery (1-5):");
  const rating = Number(ratingStr);
  if (!rating || rating < 1 || rating > 5) {
    alert("Rating must be between 1 and 5");
    return;
  }
  const comment = prompt("Comment (optional):") || "";
  try {
    const res = await fetch(`${API_BASE}/api/orders/${orderId}/rate`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ rating, comment }),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.message || "Failed to save rating", "error");
      return;
    }
    showToast("Thanks for your feedback!");
    loadOrderHistory();
  } catch (err) {
    console.error(err);
    showToast("Network error", "error");
  }
}

// Pay order (digital)
async function handlePayOrder(orderId) {
  if (!confirm("Proceed to record digital payment?")) return;
  try {
    const res = await fetch(`${API_BASE}/api/orders/${orderId}/pay`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ paymentMethod: "Easypaisa" }),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.message || "Payment failed", "error");
      return;
    }
    showToast(
      `Payment recorded. Transaction ID: ${data.transactionId || "N/A"}`
    );
    loadOrderHistory();
  } catch (err) {
    console.error(err);
    showToast("Network error", "error");
  }
}

// Issue form
if ($("issue-form")) {
  $("issue-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      orderId: form.orderId.value.trim() || undefined,
      category: form.category.value,
      description: form.description.value.trim(),
    };
    try {
      const res = await fetch(`${API_BASE}/api/issues`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Failed to submit issue", "error");
        return;
      }
      showToast("Issue submitted");
      form.reset();
    } catch (err) {
      console.error(err);
      showToast("Network error", "error");
    }
  });
}

// ====== ADMIN PANEL ======

async function loadAdminSummary() {
  try {
    const res = await fetch(`${API_BASE}/api/admin/summary`, {
      headers: authHeaders(),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.message || "Unable to load summary", "error");
      return;
    }
    const container = $("summary-cards");
    container.innerHTML = "";

    const cards = [
      ["Total Orders", data.totalOrders],
      ["Pending", data.pendingOrders],
      ["Assigned", data.assignedOrders],
      ["Out for Delivery", data.outForDelivery],
      ["Delivered", data.deliveredOrders],
      ["Est. Revenue", "Rs " + data.totalRevenue],
    ];

    cards.forEach(([label, value]) => {
      const div = document.createElement("div");
      div.className = "summary-card";
      div.innerHTML = `
        <div class="summary-label">${label}</div>
        <div class="summary-value">${value}</div>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
  }
}

// Customers list
async function loadCustomers() {
  try {
    const search = $("customer-search").value.trim();
    const res = await fetch(
      `${API_BASE}/api/customers?search=${encodeURIComponent(search)}`,
      {
        headers: authHeaders(),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      showToast(data.message || "Failed to load customers", "error");
      return;
    }
    const tbody = $("customers-table").querySelector("tbody");
    tbody.innerHTML = "";
    data.forEach((c) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${c.name}</td>
        <td>${c.email}</td>
        <td>${c.phone || "-"}</td>
        <td>${c.branch || "-"}</td>
        <td>
          <button data-cust-edit="${c._id}" class="btn tiny secondary">Edit</button>
          <button data-cust-del="${c._id}" class="btn tiny danger">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll("[data-cust-del]").forEach((btn) => {
      btn.onclick = () => handleDeleteCustomer(btn.dataset.custDel);
    });
    tbody.querySelectorAll("[data-cust-edit]").forEach((btn) => {
      btn.onclick = () => handleEditCustomer(btn.dataset.custEdit);
    });
  } catch (err) {
    console.error(err);
  }
}

if ($("customer-search")) {
  $("customer-search").addEventListener("input", () => {
    loadCustomers();
  });
}

async function handleDeleteCustomer(id) {
  if (!confirm("Delete this customer?")) return;
  try {
    const res = await fetch(`${API_BASE}/api/customers/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.message || "Delete failed", "error");
      return;
    }
    showToast("Customer deleted");
    loadCustomers();
  } catch (err) {
    console.error(err);
    showToast("Network error", "error");
  }
}

async function handleEditCustomer(id) {
  const newPhone = prompt("New phone (leave blank to keep):") || "";
  const newAddress = prompt("New address (leave blank to keep):") || "";
  if (!newPhone && !newAddress) return;
  try {
    const res = await fetch(`${API_BASE}/api/customers/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ phone: newPhone || undefined, address: newAddress || undefined }),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.message || "Update failed", "error");
      return;
    }
    showToast("Customer updated");
    loadCustomers();
  } catch (err) {
    console.error(err);
    showToast("Network error", "error");
  }
}

// Workers
async function loadWorkers() {
  try {
    const res = await fetch(`${API_BASE}/api/customers?role=worker`, {
      headers: authHeaders(),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.message || "Failed to load workers", "error");
      return;
    }
    const tbody = $("workers-table").querySelector("tbody");
    tbody.innerHTML = "";
    data.forEach((w) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${w.name}</td>
        <td>${w.email}</td>
        <td>${w.branch || "-"}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
  }
}

if ($("refresh-workers")) {
  $("refresh-workers").addEventListener("click", loadWorkers);
}

// Orders (admin)
async function loadAdminOrders() {
  try {
    const status = $("orders-status-filter").value;
    const res = await fetch(
      `${API_BASE}/api/orders?status=${encodeURIComponent(status || "")}`,
      { headers: authHeaders() }
    );
    const data = await res.json();
    if (!res.ok) {
      showToast(data.message || "Failed to load orders", "error");
      return;
    }
    const tbody = $("orders-table").querySelector("tbody");
    tbody.innerHTML = "";
    data.forEach((o) => {
      const paymentStr = `${o.paymentMethod || "COD"} / ${
        o.paymentStatus || "Unpaid"
      }`;
      const ratingStr = o.rating ? `${o.rating}★` : "-";
      const workerName = o.assignedWorkerName || "-";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${o.orderCode}</td>
        <td>${o.customerName || (o.customer && o.customer.name) || ""}</td>
        <td>${o.zone || "-"}</td>
        <td>${o.status}</td>
        <td>${workerName}</td>
        <td>${paymentStr}</td>
        <td>${ratingStr}</td>
        <td>
          <button data-order-assign="${o._id}" class="btn tiny secondary">Assign</button>
          <button data-order-auto="${o._id}" class="btn tiny">Auto</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll("[data-order-assign]").forEach((btn) => {
      btn.onclick = () => handleManualAssign(btn.dataset.orderAssign);
    });
    tbody.querySelectorAll("[data-order-auto]").forEach((btn) => {
      btn.onclick = () => handleAutoAssign(btn.dataset.orderAuto);
    });
  } catch (err) {
    console.error(err);
  }
}

if ($("refresh-orders")) {
  $("refresh-orders").addEventListener("click", () => {
    loadAdminOrders();
  });
}
if ($("orders-status-filter")) {
  $("orders-status-filter").addEventListener("change", loadAdminOrders);
}

async function handleManualAssign(orderId) {
  const workerEmail = prompt("Enter worker email to assign:");
  if (!workerEmail) return;
  try {
    // find workers, then match email
    const resWorkers = await fetch(
      `${API_BASE}/api/customers?role=worker&search=${encodeURIComponent(
        workerEmail
      )}`,
      {
        headers: authHeaders(),
      }
    );
    const workers = await resWorkers.json();
    const worker = workers.find((w) => w.email === workerEmail);
    if (!worker) {
      showToast("Worker not found", "error");
      return;
    }

    const res = await fetch(`${API_BASE}/api/orders/${orderId}/assign`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ workerId: worker._id }),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.message || "Assign failed", "error");
      return;
    }
    showToast("Order assigned");
    loadAdminOrders();
  } catch (err) {
    console.error(err);
    showToast("Network error", "error");
  }
}

async function handleAutoAssign(orderId) {
  try {
    const res = await fetch(`${API_BASE}/api/orders/${orderId}/assign`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ mode: "auto" }),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.message || "Auto-assign failed", "error");
      return;
    }
    showToast("Order auto-assigned");
    loadAdminOrders();
  } catch (err) {
    console.error(err);
    showToast("Network error", "error");
  }
}

// Revenue report
if ($("revenue-form")) {
  $("revenue-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const params = new URLSearchParams();
    if (form.startDate.value) params.append("startDate", form.startDate.value);
    if (form.endDate.value) params.append("endDate", form.endDate.value);

    try {
      const res = await fetch(
        `${API_BASE}/api/admin/revenue?${params.toString()}`,
        { headers: authHeaders() }
      );
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Failed to load revenue", "error");
        return;
      }
      $("revenue-output").textContent = JSON.stringify(data, null, 2);
    } catch (err) {
      console.error(err);
      showToast("Network error", "error");
    }
  });
}

// Loyalty
if ($("load-loyalty")) {
  $("load-loyalty").addEventListener("click", async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/loyalty`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Failed to load loyalty", "error");
        return;
      }
      const tbody = $("loyalty-table").querySelector("tbody");
      tbody.innerHTML = "";
      data.forEach((row) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${row.name}</td>
          <td>${row.orderCount}</td>
          <td>${row.tier}</td>
          <td>${row.loyaltyPoints}</td>
        `;
        tbody.appendChild(tr);
      });
    } catch (err) {
      console.error(err);
      showToast("Network error", "error");
    }
  });
}

// Campaign form
if ($("campaign-form")) {
  $("campaign-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      audience: form.audience.value,
      title: form.title.value.trim(),
      message: form.message.value.trim(),
    };
    try {
      const res = await fetch(`${API_BASE}/api/admin/notifications`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Campaign failed", "error");
        return;
      }
      showToast("Campaign sent");
      form.reset();
      if (currentUser.role === "customer") {
        loadNotifications();
      }
    } catch (err) {
      console.error(err);
      showToast("Network error", "error");
    }
  });
}

// Issues table (admin)
async function loadIssues() {
  try {
    const res = await fetch(`${API_BASE}/api/issues`, {
      headers: authHeaders(),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.message || "Failed to load issues", "error");
      return;
    }
    const tbody = $("issues-table").querySelector("tbody");
    tbody.innerHTML = "";
    data.forEach((t) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${t._id}</td>
        <td>${t.customer ? t.customer.name : "-"}</td>
        <td>${t.order ? t.order.orderCode : "-"}</td>
        <td>${t.category || "-"}</td>
        <td>${t.description}</td>
        <td>${t.status}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
  }
}

if ($("refresh-issues")) {
  $("refresh-issues").addEventListener("click", loadIssues);
}

// Initial admin data if already logged in
if (currentUser && currentUser.role === "admin") {
  loadAdminSummary();
  loadCustomers();
  loadWorkers();
  loadAdminOrders();
  loadIssues();
}

// ====== WORKER PANEL ======

async function loadWorkerOrders() {
  try {
    const res = await fetch(`${API_BASE}/api/worker/orders`, {
      headers: authHeaders(),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.message || "Failed to load orders", "error");
      return;
    }
    const tbody = $("worker-orders-table").querySelector("tbody");
    tbody.innerHTML = "";
    data.forEach((o) => {
      const paymentStr = `${o.paymentMethod || "COD"} / ${
        o.paymentStatus || "Unpaid"
      }`;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${o.orderCode}</td>
        <td>${o.customerName || (o.customer && o.customer.name) || ""}</td>
        <td>
          ${o.customerAddress || "-"}<br />
          <button data-map="${encodeURIComponent(
            o.customerAddress || ""
          )}" class="btn tiny secondary">Map</button>
        </td>
        <td>${o.status}</td>
        <td>${paymentStr}</td>
        <td>
          <button data-status="${o._id}" data-next="${
        o.status === "Assigned" ? "OutForDelivery" : "Delivered"
      }" class="btn tiny">
            ${
              o.status === "Assigned"
                ? "Start Delivery"
                : o.status === "OutForDelivery"
                ? "Mark Delivered"
                : "Done"
            }
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll("[data-status]").forEach((btn) => {
      btn.onclick = () =>
        handleWorkerStatusChange(btn.dataset.status, btn.dataset.next);
    });
    tbody.querySelectorAll("[data-map]").forEach((btn) => {
      btn.onclick = () => {
        const addr = decodeURIComponent(btn.dataset.map);
        if (!addr) return;
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          addr
        )}`;
        window.open(url, "_blank");
      };
    });
  } catch (err) {
    console.error(err);
  }
}

async function handleWorkerStatusChange(orderId, nextStatus) {
  try {
    const res = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ status: nextStatus }),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.message || "Status update failed", "error");
      return;
    }
    showToast("Status updated");
    loadWorkerOrders();
  } catch (err) {
    console.error(err);
    showToast("Network error", "error");
  }
}

if ($("refresh-worker-orders")) {
  $("refresh-worker-orders").addEventListener("click", loadWorkerOrders);
}

// Worker routes
async function loadWorkerRoutes() {
  try {
    const res = await fetch(`${API_BASE}/api/worker/routes`, {
      headers: authHeaders(),
    });
    const data = await res.json();
    if (!res.ok) return;
    const tbody = $("routes-table").querySelector("tbody");
    tbody.innerHTML = "";
    data.forEach((o) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${o.sequence}</td>
        <td>${o.orderCode}</td>
        <td>${o.etaMinutes}</td>
        <td>
          <button data-map="${encodeURIComponent(
            o.customerAddress || ""
          )}" class="btn tiny secondary">Navigate</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
    tbody.querySelectorAll("[data-map]").forEach((btn) => {
      btn.onclick = () => {
        const addr = decodeURIComponent(btn.dataset.map);
        if (!addr) return;
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          addr
        )}`;
        window.open(url, "_blank");
      };
    });
  } catch (err) {
    console.error(err);
  }
}

if ($("refresh-routes")) {
  $("refresh-routes").addEventListener("click", loadWorkerRoutes);
}

// Worker payments
async function loadWorkerPayments() {
  try {
    const res = await fetch(`${API_BASE}/api/worker/payments`, {
      headers: authHeaders(),
    });
    const data = await res.json();
    if (!res.ok) return;
    const tbody = $("payments-table").querySelector("tbody");
    tbody.innerHTML = "";
    data.forEach((p) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.orderCode}</td>
        <td>${p.paymentMethod}</td>
        <td>${p.paymentStatus}</td>
        <td>${p.deliveryCharge}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
  }
}

if ($("refresh-payments")) {
  $("refresh-payments").addEventListener("click", loadWorkerPayments);
}

// Initial loads when dashboard first opens
if (currentUser && currentUser.role === "customer") {
  loadCustomerProfile();
  loadOrderHistory();
  loadNotifications();
  loadSettingsBanner();
}
if (currentUser && currentUser.role === "admin") {
  loadAdminSummary();
  loadCustomers();
  loadWorkers();
  loadAdminOrders();
  loadIssues();
  loadSettingsBanner();
}
if (currentUser && currentUser.role === "worker") {
  loadWorkerOrders();
  loadWorkerRoutes();
  loadWorkerPayments();
  loadSettingsBanner();
}
