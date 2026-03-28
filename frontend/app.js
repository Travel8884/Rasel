const API_URL = "http://localhost:8000";
let token = "";

const output = (id, data) => {
  document.getElementById(id).textContent =
    typeof data === "string" ? data : JSON.stringify(data, null, 2);
};

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: token ? `Bearer ${token}` : "",
});

document.getElementById("login-btn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  token = data.access_token || "";
  output("auth-output", data);
});

document.getElementById("me-btn").addEventListener("click", async () => {
  const res = await fetch(`${API_URL}/users/me`, { headers: authHeaders() });
  output("me-output", await res.json());
});

document.getElementById("save-settings-btn").addEventListener("click", async () => {
  const payload = {
    company_name: document.getElementById("company_name").value,
    company_logo_url: document.getElementById("company_logo_url").value,
    support_email: document.getElementById("support_email").value,
    timezone: document.getElementById("timezone").value,
  };
  const res = await fetch(`${API_URL}/settings/system`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  output("settings-output", await res.json());
});

document.getElementById("load-settings-btn").addEventListener("click", async () => {
  const res = await fetch(`${API_URL}/settings/system`, { headers: authHeaders() });
  output("settings-output", await res.json());
});

document.getElementById("logs-btn").addEventListener("click", async () => {
  const res = await fetch(`${API_URL}/activity-logs?limit=25`, { headers: authHeaders() });
  output("logs-output", await res.json());
});
