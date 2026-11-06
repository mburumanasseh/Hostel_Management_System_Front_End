import { useEffect, useMemo, useState } from "react";
import {
  bookRoom,
  getAvailableRooms,
  getMyAllocation,
} from "../api";

export default function BookRoom() {
  const [rooms, setRooms] = useState([]);
  const [availableCount, setAvailableCount] = useState(0);
  const [myAllocation, setMyAllocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filterBlock, setFilterBlock] = useState("all");
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [roomsRes, mineRes] = await Promise.all([
        getAvailableRooms(),
        getMyAllocation(),
      ]);

      const list = roomsRes.data?.rooms || [];
      setRooms(list);
      setAvailableCount(
        roomsRes.data?.count ?? list.length
      );
      setMyAllocation(mineRes.data?.allocation ?? null);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to load rooms"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const blocks = useMemo(() => {
    const names = new Set();
    rooms.forEach((r) => {
      if (r.block?.name) names.add(r.block.name);
    });
    return Array.from(names).sort();
  }, [rooms]);

  const filtered = useMemo(() => {
    return rooms.filter((r) => {
      if (filterBlock !== "all" && r.block?.name !== filterBlock) {
        return false;
      }
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const hay = `${r.room_number} ${r.block?.name || ""} ${r.floor}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [rooms, filterBlock, search]);

  const handleBook = async (roomId) => {
    setError("");
    setSuccess("");
    setBookingId(roomId);
    try {
      const res = await bookRoom(roomId);
      setSuccess(res.data?.message || "Room booked successfully");
      await load();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Booking failed"
      );
    } finally {
      setBookingId(null);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading available rooms...
      </div>
    );
  }

  const hasActive = Boolean(myAllocation);

  return (
    <div className="book-room-page">
      <div className="page-header" style={{ marginBottom: "1.25rem" }}>
        <h1>Book a Room</h1>
        <p style={{ opacity: 0.8, marginTop: "0.35rem" }}>
          Choose an available room. Rooms with free beds are listed below.
        </p>
      </div>

      {error && (
        <div className="alert error" style={{ marginBottom: "1rem" }}>
          {error}
        </div>
      )}
      {success && (
        <div className="alert success" style={{ marginBottom: "1rem" }}>
          {success}
        </div>
      )}

      <div
        className="metric-card"
        style={{ marginBottom: "1.25rem", maxWidth: 360 }}
      >
        <h2>{availableCount}</h2>
        <p>Rooms with free space</p>
        <span className="metric-subtext">
          Not full and not under maintenance
        </span>
      </div>

      {hasActive && (
        <div
          className="alert"
          style={{
            marginBottom: "1.25rem",
            padding: "1rem",
            borderRadius: 8,
            background: "rgba(34, 197, 94, 0.12)",
            border: "1px solid rgba(34, 197, 94, 0.35)",
          }}
        >
          <strong>You already have an active allocation.</strong>
          <div style={{ marginTop: 8 }}>
            Room{" "}
            <strong>
              {myAllocation.room?.room_number ||
                myAllocation.room_id}
            </strong>
            {myAllocation.room?.block?.name
              ? ` · ${myAllocation.room.block.name}`
              : ""}
            {myAllocation.status ? ` · ${myAllocation.status}` : ""}
          </div>
          <p style={{ marginTop: 8, opacity: 0.85 }}>
            You cannot book another room until the current one is
            completed by a warden or admin.
          </p>
        </div>
      )}

      {!hasActive && (
        <>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              marginBottom: "1rem",
              alignItems: "center",
            }}
          >
            <input
              type="search"
              placeholder="Search room number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: 8,
                border: "1px solid #333",
                minWidth: 200,
              }}
            />
            <select
              value={filterBlock}
              onChange={(e) => setFilterBlock(e.target.value)}
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: 8,
                border: "1px solid #333",
              }}
            >
              <option value="all">All blocks</option>
              {blocks.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <p>No available rooms match your filters.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="data-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Room</th>
                    <th>Block</th>
                    <th>Floor</th>
                    <th>Gender</th>
                    <th>Occupancy</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((room) => {
                    const free =
                      (room.capacity || 0) - (room.occupied || 0);
                    return (
                      <tr key={room.id}>
                        <td>
                          <strong>{room.room_number}</strong>
                        </td>
                        <td>{room.block?.name || "—"}</td>
                        <td>{room.floor ?? "—"}</td>
                        <td>{room.block?.gender || "—"}</td>
                        <td>
                          {room.occupied}/{room.capacity}
                          <span style={{ opacity: 0.7 }}>
                            {" "}
                            ({free} free)
                          </span>
                        </td>
                        <td>{room.status}</td>
                        <td>
                          <button
                            type="button"
                            className="login-button"
                            style={{
                              padding: "0.4rem 0.85rem",
                              fontSize: "0.9rem",
                            }}
                            disabled={bookingId === room.id}
                            onClick={() => handleBook(room.id)}
                          >
                            {bookingId === room.id
                              ? "Booking..."
                              : "Book"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
