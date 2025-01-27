import { useState, useEffect, useRef } from "react";
import axios from "axios";

// const BASE_URL = "http://localhost:8080/api/v1/";

const BASE_URL = import.meta.env.VITE_URL;

function App() {
  const [students, setStudents] = useState([]);
  const formRef = useRef();

  const fetchAllStudents = async () => {
    try {
      const response = await axios.get(`${BASE_URL}students`);
      setStudents(response.data);
    } catch (error) {
      console.log("Error from fetching students:", error);
    }
  };

  useEffect(() => {
    // Get Students from the back-end server here
    fetchAllStudents();
  }, []);

  const addStudent = async (e) => {
    e.preventDefault();
    // Add students to the back-end server, and then update the state with the response
    try {
      const newStudent = {
        name: formRef.current.name.value,
        program: formRef.current.program.value,
        grade: formRef.current.grade.value,
      };

      const response = await axios.post(`${BASE_URL}students`, newStudent);

      setStudents((prevStudents) => [...prevStudents, response.data]);

      // Clear the form fields after successful submission
      formRef.current.reset();
    } catch (error) {
      console.log("Error from adding new student:", error);
    }
  };

  const renderedStudents = students.map((student) => (
    <li key={student.id} className="list-group-item">
      {`${student.name}: ${student.program}, ${student.grade}`}
    </li>
  ));

  return (
    <div className="container">
      <div className="row">
        <div className="col-4">
          <h2>Add Student</h2>
          <form onSubmit={addStudent} ref={formRef}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter Student Name"
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="program">Program</label>
              <input
                type="text"
                id="program"
                placeholder="Enter Program"
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Grade</label>
              <input
                type="text"
                id="grade"
                placeholder="Enter Grade"
                className="form-control"
              />
            </div>
            <button className="btn btn-primary">Submit</button>
          </form>
        </div>
        <div className="col-8">
          <h2>Students</h2>
          <ul className="list-group">{renderedStudents}</ul>
        </div>
      </div>
    </div>
  );
}

export default App;
