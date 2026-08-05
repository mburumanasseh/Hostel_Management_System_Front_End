
import { useEffect, useState } from "react";

import {
  getAllocations,
  createAllocation,
  getStudents,
  getRooms,
  getMyAllocation,
} from "../api";

import { getUserRole } from "../utils/auth";


export default function RoomAllocation() {

  const role = getUserRole();


  // =====================================================
  // STUDENT STATE
  // =====================================================

  const [myAllocation, setMyAllocation] = useState(null);


  // =====================================================
  // ADMIN / WARDEN STATE
  // =====================================================

  const [allocations, setAllocations] = useState([]);

  const [students, setStudents] = useState([]);

  const [rooms, setRooms] = useState([]);


  // =====================================================
  // ALLOCATION FORM STATE
  // =====================================================

  const [studentId, setStudentId] = useState("");

  const [roomId, setRoomId] = useState("");


  // =====================================================
  // COMMON STATE
  // =====================================================

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");


  // =====================================================
  // LOAD ADMIN / WARDEN DATA
  // =====================================================

  const loadAdminData = async () => {

    const [
      allocationResponse,
      studentResponse,
      roomResponse,
    ] = await Promise.all([
      getAllocations(),
      getStudents(),
      getRooms(),
    ]);


    // -----------------------------------------------
    // ALLOCATIONS
    // -----------------------------------------------

    setAllocations(
      allocationResponse.data?.allocations || []
    );


    // -----------------------------------------------
    // STUDENTS
    // -----------------------------------------------

    setStudents(
      studentResponse.data?.students ||
      studentResponse.data ||
      []
    );


    // -----------------------------------------------
    // ROOMS
    // -----------------------------------------------

    setRooms(
      roomResponse.data?.rooms ||
      roomResponse.data ||
      []
    );
  };


  // =====================================================
  // LOAD PAGE DATA
  // =====================================================

  useEffect(() => {

    const loadData = async () => {

      setLoading(true);

      setError("");

      setSuccess("");


      try {

        // =============================================
        // STUDENT
        // =============================================

        if (role === "student") {

          const response =
            await getMyAllocation();


          setMyAllocation(
            response.data?.allocation || null
          );


          return;
        }


        // =============================================
        // ADMIN / WARDEN
        // =============================================

        if (
          role === "admin" ||
          role === "warden"
        ) {

          await loadAdminData();

          return;
        }


        // =============================================
        // UNKNOWN ROLE
        // =============================================

        setError(
          "You do not have permission to access room allocation."
        );

      } catch (err) {

        console.error(
          "Failed to load room allocation data:",
          err
        );


        setError(
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to load room allocation data."
        );

      } finally {

        setLoading(false);

      }

    };


    loadData();

  }, [role]);


  // =====================================================
  // ADMIN / WARDEN
  // ALLOCATE ROOM
  // =====================================================

  const handleAllocate = async () => {

    // -----------------------------------------------
    // VALIDATE STUDENT
    // -----------------------------------------------

    if (!studentId) {

      setError(
        "Please select a student."
      );

      return;
    }


    // -----------------------------------------------
    // VALIDATE ROOM
    // -----------------------------------------------

    if (!roomId) {

      setError(
        "Please select a room."
      );

      return;
    }


    setSubmitting(true);

    setError("");

    setSuccess("");


    try {

      // ---------------------------------------------
      // SEND ALLOCATION REQUEST
      // ---------------------------------------------

      const response =
        await createAllocation({

          student_id: Number(studentId),

          room_id: Number(roomId),

        });


      // ---------------------------------------------
      // SUCCESS MESSAGE
      // ---------------------------------------------

      setSuccess(
        response.data?.message ||
        "Room allocated successfully."
      );


      // ---------------------------------------------
      // CLEAR FORM
      // ---------------------------------------------

      setStudentId("");

      setRoomId("");


      // ---------------------------------------------
      // RELOAD DATA
      // ---------------------------------------------

      await loadAdminData();

    } catch (err) {

      console.error(
        "Failed to allocate room:",
        err
      );


      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to allocate room."
      );

    } finally {

      setSubmitting(false);

    }
  };


  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {

    return (

      <div className="room-allocation">

        <h2>Room Allocation</h2>

        <p>
          Loading room information...
        </p>

      </div>

    );
  }


  // =====================================================
  // STUDENT VIEW
  // =====================================================

  if (role === "student") {

    return (

      <div className="room-allocation">

        <h2>My Room</h2>

        <p>
          View your current hostel room allocation.
        </p>


        {/* =========================================
            ERROR
        ========================================= */}

        {error && (

          <p className="error">

            {typeof error === "object"
              ? JSON.stringify(error)
              : error}

          </p>

        )}


        {/* =========================================
            NO ROOM
        ========================================= */}

        {!myAllocation ? (

          <div className="empty-state">

            <h3>
              No Room Allocated
            </h3>

            <p>
              You currently do not have an active
              room allocation.
            </p>

          </div>

        ) : (

          /* =======================================
             ROOM CARD
          ======================================= */

          <div className="my-room-card">

            <div className="room-card-header">

              <h3>
                Your Hostel Room
              </h3>

              <span className="room-status">

                {myAllocation.status ||
                  "Active"}

              </span>

            </div>


            <div className="room-details">


              {/* ROOM */}

              <div className="room-detail">

                <span>
                  Room
                </span>

                <strong>

                  {myAllocation.room?.room_number ||

                    (
                      myAllocation.room_id
                        ? `Room ${myAllocation.room_id}`
                        : "Not specified"
                    )}

                </strong>

              </div>


              {/* BLOCK */}

              <div className="room-detail">

                <span>
                  Block
                </span>

                <strong>

                  {myAllocation.room?.block?.name ||

                    "Block information unavailable"}

                </strong>

              </div>


              {/* FLOOR */}

              <div className="room-detail">

                <span>
                  Floor
                </span>

                <strong>

                  {myAllocation.room?.floor ??
                    "Not specified"}

                </strong>

              </div>


              {/* CAPACITY */}

              <div className="room-detail">

                <span>
                  Capacity
                </span>

                <strong>

                  {myAllocation.room?.capacity ??
                    "Not specified"}

                </strong>

              </div>


              {/* OCCUPIED */}

              <div className="room-detail">

                <span>
                  Occupied
                </span>

                <strong>

                  {myAllocation.room?.occupied ??
                    "Not specified"}

                </strong>

              </div>


              {/* ROOM STATUS */}

              <div className="room-detail">

                <span>
                  Room Status
                </span>

                <strong>

                  {myAllocation.room?.status ||
                    "Not specified"}

                </strong>

              </div>


              {/* ALLOCATION DATE */}

              <div className="room-detail">

                <span>
                  Allocation Date
                </span>

                <strong>

                  {myAllocation.allocation_date
                    ? new Date(
                        myAllocation.allocation_date
                      ).toLocaleDateString()
                    : "Not specified"}

                </strong>

              </div>


            </div>

          </div>

        )}

      </div>

    );
  }


  // =====================================================
  // CHECK ADMIN / WARDEN ACCESS
  // =====================================================

  if (
    role !== "admin" &&
    role !== "warden"
  ) {

    return (

      <div className="room-allocation">

        <h2>
          Room Allocation
        </h2>

        <p className="error">
          You do not have permission to access
          room allocation management.
        </p>

      </div>

    );
  }


  // =====================================================
  // AVAILABLE STUDENTS
  // =====================================================

  /*
   * Only students who do NOT currently have
   * an active room allocation can be selected.
   */

  const availableStudents =
    students.filter(
      (student) =>
        !student.active_allocation
    );


  // =====================================================
  // AVAILABLE ROOMS
  // =====================================================

  /*
   * A room is available when:
   *
   * 1. It is not under maintenance.
   * 2. It has capacity.
   * 3. Occupancy is lower than capacity.
   */

  const availableRooms =
    rooms.filter((room) => {

      const occupied =
        Number(room.occupied || 0);

      const capacity =
        Number(room.capacity || 0);


      return (

        room.status !== "Maintenance" &&

        capacity > 0 &&

        occupied < capacity

      );

    });


  // =====================================================
  // ADMIN / WARDEN VIEW
  // =====================================================

  return (

    <div className="room-allocation">


      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <h2>
        Room Allocation
      </h2>

      <p>
        Allocate hostel rooms to students with
        registered accounts.
      </p>


      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {error && (

        <p className="error">

          {typeof error === "object"
            ? JSON.stringify(error)
            : error}

        </p>

      )}


      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {success && (

        <p className="success">
          {success}
        </p>

      )}


      {/* =================================================
          ALLOCATION FORM
      ================================================= */}

      <div className="allocate-form">


        {/* ===============================================
            STUDENT SELECT
        =============================================== */}

        <select

          value={studentId}

          onChange={(event) =>
            setStudentId(
              event.target.value
            )
          }

          disabled={
            submitting ||
            availableStudents.length === 0
          }

        >

          <option value="">

            {availableStudents.length === 0

              ? "No students awaiting allocation"

              : "Select Student"}

          </option>


          {availableStudents.map(
            (student) => (

              <option
                key={student.id}
                value={student.id}
              >

                {student.first_name || ""}{" "}

                {student.last_name || ""}

                {" — "}

                {student.email ||
                  "No email"}

                {" — "}

                {student.registration_number ||
                  "No registration number"}

              </option>

            )
          )}

        </select>


        {/* ===============================================
            ROOM SELECT
        =============================================== */}

        <select

          value={roomId}

          onChange={(event) =>
            setRoomId(
              event.target.value
            )
          }

          disabled={
            submitting ||
            availableRooms.length === 0
          }

        >

          <option value="">

            {availableRooms.length === 0

              ? "No rooms available"

              : "Select Room"}

          </option>


          {availableRooms.map(
            (room) => {

              const occupied =
                Number(room.occupied || 0);

              const capacity =
                Number(room.capacity || 0);


              return (

                <option
                  key={room.id}
                  value={room.id}
                >

                  Room{" "}

                  {room.room_number ||
                    room.number ||
                    room.id}

                  {" — "}

                  {occupied}/{capacity}

                  {" occupied"}

                  {room.block?.name
                    ? ` — ${room.block.name}`
                    : ""}

                </option>

              );

            }
          )}

        </select>


        {/* ===============================================
            ALLOCATE BUTTON
        =============================================== */}

        <button

          type="button"

          onClick={handleAllocate}

          disabled={
            submitting ||
            !studentId ||
            !roomId
          }

        >

          {submitting
            ? "Allocating..."
            : "Allocate Room"}

        </button>

      </div>


      {/* =================================================
          STUDENT ACCOUNT OVERVIEW
      ================================================= */}

      <h3>
        Student Accounts
      </h3>


      {students.length === 0 ? (

        <p>
          No student accounts found.
        </p>

      ) : (

        <div className="table-wrapper">

          <table>

            <thead>

              <tr>

                <th>
                  Student
                </th>

                <th>
                  Email
                </th>

                <th>
                  Registration No.
                </th>

                <th>
                  Course
                </th>

                <th>
                  Room
                </th>

                <th>
                  Block
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {students.map(
                (student) => {

                  const allocation =
                    student.active_allocation;

                  const room =
                    allocation?.room;


                  return (

                    <tr
                      key={student.id}
                    >


                      {/* STUDENT */}

                      <td>

                        <strong>

                          {student.first_name || ""}{" "}

                          {student.last_name || ""}

                        </strong>

                      </td>


                      {/* EMAIL */}

                      <td>

                        {student.email ||
                          "-"}

                      </td>


                      {/* REGISTRATION */}

                      <td>

                        {student.registration_number ||
                          "-"}

                      </td>


                      {/* COURSE */}

                      <td>

                        {student.course ||
                          "-"}

                      </td>


                      {/* ROOM */}

                      <td>

                        {room?.room_number ||

                          "Not allocated"}

                      </td>


                      {/* BLOCK */}

                      <td>

                        {room?.block?.name ||
                          "-"}

                      </td>


                      {/* STATUS */}

                      <td>

                        {allocation ? (

                          <span className="allocated">

                            Allocated

                          </span>

                        ) : (

                          <span className="awaiting">

                            Awaiting Allocation

                          </span>

                        )}

                      </td>

                    </tr>

                  );

                }
              )}

            </tbody>

          </table>

        </div>

      )}


      {/* =================================================
          CURRENT ALLOCATIONS
      ================================================= */}

      <h3>
        Current Allocations
      </h3>


      {allocations.length === 0 ? (

        <p>
          No room allocations yet.
        </p>

      ) : (

        <div className="table-wrapper">

          <table>

            <thead>

              <tr>

                <th>
                  ID
                </th>

                <th>
                  Student
                </th>

                <th>
                  Email
                </th>

                <th>
                  Room
                </th>

                <th>
                  Block
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {allocations.map(
                (allocation) => {

                  const student =
                    allocation.student;

                  const room =
                    allocation.room;


                  return (

                    <tr
                      key={allocation.id}
                    >


                      {/* ID */}

                      <td>
                        {allocation.id}
                      </td>


                      {/* STUDENT */}

                      <td>

                        {student?.first_name &&
                        student?.last_name

                          ? `${student.first_name} ${student.last_name}`

                          : student?.name ||

                            allocation.student_id}

                      </td>


                      {/* EMAIL */}

                      <td>

                        {student?.email ||
                          "-"}

                      </td>


                      {/* ROOM */}

                      <td>

                        {room?.room_number ||

                          (
                            allocation.room_id
                              ? `Room ${allocation.room_id}`
                              : "-"
                          )}

                      </td>


                      {/* BLOCK */}

                      <td>

                        {room?.block?.name ||
                          "-"}

                      </td>


                      {/* STATUS */}

                      <td>

                        {allocation.status ||
                          "Active"}

                      </td>


                    </tr>

                  );

                }
              )}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );
}
