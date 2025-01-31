import express from "express";
import cors from "cors";
const app = express();
const port = process.env.PORT || process.argv[2] || 8080;
import { v4 as uuidv4 } from "uuid";

app.use(express.json());
app.use(cors());

let students = [
  {
    id: "5dbb3dd8-49d8-4c3b-93d9-59230836b2f1",
    name: "Ari Moghadam",
    program: "Software Engineering",
    grade: 75,
  },
  {
    id: "594daba3-e1e4-4a5f-89ae-372dfb95a16d",
    name: "Katja Vukovic",
    program: "UX",
    grade: 72,
  },
  {
    id: "9c05b68b-e51b-42ce-8b89-10f8aa32db2b",
    name: "Callum Vickers",
    program: "Software Engineering",
    grade: 87,
  },
  {
    id: "5c49d6a0-74a2-4202-af90-204ef0e35fbc",
    name: "Joel Makinson",
    program: "Software Engineering",
    grade: 92,
  },
  {
    id: "23e91f79-f553-4f4f-88ac-09070cb38ac1",
    name: "Tallulah Hill",
    program: "UX",
    grade: 78,
  },
  {
    id: "1c4b7c42-23af-4168-aced-f87cb02f5172",
    name: "Dominico Acosta",
    program: "UX",
    grade: 60,
  },
  {
    id: "86a81142-b6dc-422b-9d55-7bbc04aa012c",
    name: "Adrianna Nowicka",
    program: "Software Engineering",
    grade: 95,
  },
  {
    id: "8d8b7afa-8896-44cb-9bb7-bc21beda4fd5",
    name: "Danica Edwards",
    program: "UX",
    grade: 83,
  },
];

// GET route: Retrieve the list of all students
app.get("/api/v1/students", (req, res) => {
  res.json(students);
});

// POST route: Add a new student to the list
app.post("/api/v1/students", (req, res) => {
  const { name, program, grade } = req.body;
  const newStudent = {
    id: uuidv4(),
    name,
    program,
    grade,
  };
  students.push(newStudent);
  res.json(newStudent);
});

// DELETE route: Delete a student from the list
app.delete("/api/v1/students/:id", (req, res) => {
  const { id } = req.params;
  students = students.filter((student) => student.id !== id);

  res.json(students);
});

app.listen(port, () => console.log(`Listening on ${port}`));
