import { useState, useEffect } from "react";
import api from "../../services/Api";
import { getUser } from "../../utils/auth";
import Loader from "../../components/Loader/Loader";

function StudentsTab() {
  const user = getUser();
  const hostelId = user.hostel?._id || user.hostel;

  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Backend kisi bhi field name se students bheje
  const getRoomStudents = (room) => {
    return (
      room.studentsAllotted ||
      room.students ||
      room.allottedStudents ||
      room.occupants ||
      []
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, roomsRes] = await Promise.all([
          api.get("/auth/students"),
          api.get(`/rooms/hostel/${hostelId}`),
        ]);

        console.log("ROOMS:", roomsRes.data);
        console.log("ALL STUDENTS:", studentsRes.data);

        setRooms(roomsRes.data);

        // Hostel ke rooms mein allotted students nikalo
        const hostelStudentIds = new Set(
          roomsRes.data.flatMap((room) =>
            getRoomStudents(room).map((student) => student._id)
          )
        );

        console.log("HOSTEL STUDENT IDS:", hostelStudentIds);

        // Sirf hostel ke students show karo
        const hostelStudents = studentsRes.data.filter((student) =>
          hostelStudentIds.has(student._id)
        );

        console.log("HOSTEL STUDENTS:", hostelStudents);

        setStudents(hostelStudents);

      } catch (err) {
        console.error("Failed to fetch students:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hostelId]);


  const findRoomForStudent = (studentId) => {
    return rooms.find((room) =>
      getRoomStudents(room).some(
        (student) => student._id === studentId
      )
    );
  };


  if (loading) {
    return <Loader text="Loading students..." />;
  }


  return (
    <div className="students-section">

      <h3 className="tab-heading">
        Students in Your Hostel ({students.length})
      </h3>


      {students.length === 0 ? (
        <div className="empty-state">
          <p>No students currently living in your hostel.</p>
        </div>
      ) : (

        <div className="students-table">

          <div className="students-table-header">
            <span>Name</span>
            <span>Email</span>
            <span>Room</span>
          </div>


          {students.map((student) => {

            const room = findRoomForStudent(student._id);

            return (
              <div
                className="students-table-row"
                key={student._id}
              >

                <span>{student.name}</span>

                <span>{student.email}</span>

                <span>
                  {room
                    ? `Room ${room.roomNumber}`
                    : "-"
                  }
                </span>

              </div>
            );

          })}

        </div>

      )}

    </div>
  );
}

export default StudentsTab;