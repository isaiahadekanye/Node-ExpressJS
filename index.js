const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json);

const courses = [
  {
    _id: 1,
    name: "CourseA"
  },
  {
    _id: 2,
    name: "CourseB"
  },
  {
    _id: 3,
    name: "CourseC"
  }
];

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c._id === parseInt(req.params.id));
  if (!course) return res.status(404).send("Error Course not available");

  res.send(course);
});

app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = {
    _id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});

app.put("/api/courses", (req, res) => {
  const course = courses.find(c => c._id === parseInt(req.params.id));
  if (!course) return res.status(404).send("Error Course not available");

  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  course.name = req.body.name;
  res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c._id === parseInt(req.params.id));
  if (!course) return res.status(404).send("Error Course not available");

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
});

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required
  };
  return Joi.validate(course, schema);
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listening on port ${port}...`));
