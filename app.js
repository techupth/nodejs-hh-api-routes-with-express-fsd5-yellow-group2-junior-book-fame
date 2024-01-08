import express from "express";
import { assignments } from "./data/assignments.js";

let assignmentsMockDataBase = assignments;

let app = express();
let port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/assignments", (req, res) => {
  const limit = req.query.limit;
  if (limit > 100) {
    res.status(401).json({
      message: "message: Invalid request,limit must not exceeds 10 assignments",
    });
  }

  const assignmentsWithLimit = assignmentsMockDataBase.slice(0, limit);

  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentsWithLimit,
  });
});

app.get("/assignments/:assignmentId", (req, res) => {
  const assignmentIdFromClient = Number(req.params.assignmentId);
  let postData = assignmentsMockDataBase.filter(
    (item) => item.id === assignmentIdFromClient
  );
  return res.json({
    message: "Complete Fetching assignments",
    data: postData[0],
  });
});

app.post("/assignments", (req, res) => {
  const newCreatedAssignment = req.body;
  assignmentsMockDataBase.push({
    id: assignmentsMockDataBase[assignmentsMockDataBase.length - 1].id + 1,
    ...newCreatedAssignment,
  });
  return res.json({
    message: "Assignment has been created successfully",
    data: assignmentsMockDataBase,
  });
});

app.delete("/assignments/:assignmentId", (req, res) => {
  const assignmentIdFromClient = Number(req.params.assignmentId);
  const newAssignment = assignmentsMockDataBase.filter((item) => {
    return item.id !== assignmentIdFromClient;
  });

  if (!assignmentIdFromClient) {
    res.json({ message: "Cannot delete, No data available!" });
  }

  assignmentsMockDataBase = newAssignment;

  return res.json({ message: "Assignment has been deleted successfully" });
});

app.put("/assignments/:assignmentId", (req, res) => {
  const assignmentIdFromClient = Number(req.params.assignmentId);
  const assignmentsIndex = assignmentsMockDataBase.findIndex((item) => {
    return item.id === assignmentIdFromClient;
  });
  if (!assignmentIdFromClient) {
    return res.json({ message: "Cannot update, No data available!" });
  }
  assignmentsMockDataBase[assignmentsIndex] = {
    id: assignmentIdFromClient,
    ...req.body,
  };
  return res.json({ message: "Assignment has been updated successfully" });
});

app.listen(port, () => {
  return console.log(`Server is running at ${port}`);
});
