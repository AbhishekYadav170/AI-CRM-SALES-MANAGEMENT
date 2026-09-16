import { useAuth } from "../context/AuthContext";

export default function CustomerPortal() {
  const { user } = useAuth();

  return (
    <div style={{ padding: "40px" }}>
      <h1>Welcome, {user?.name || "Customer"}</h1>

      <p>
        Manage your conversations, orders and profile from your customer portal.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div>
          <h3>My Conversations</h3>
          <p>View your conversations with the sales team.</p>
        </div>

        <div>
          <h3>My Orders</h3>
          <p>View your order history and order status.</p>
        </div>

        <div>
          <h3>My Profile</h3>
          <p>View and manage your profile information.</p>
        </div>
      </div>
    </div>
  );
}