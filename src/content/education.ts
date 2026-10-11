import type { Education } from "./types";

export const education: Education[] = [
  {
    slug: "lncts-btech-cse",
    degree: "B.Tech Computer Science Engineering",
    institution: "Lakshmi Narain College of Technology and Science",
    location: "Bhopal, India",
    start: "2020-09",
    end: "2024-07",
    grade: "8.44/10.0 CGPA",
    coursework: [
      "Operating Systems",
      "Database Management Systems",
      "Computer Networks",
      "Data Structures & Algorithms",
      "Software Engineering",
      "Computer Architecture",
    ],
  },
  {
    slug: "iitm-learning",
    degree: "Data science learning and projects",
    institution: "IIT Madras",
    location: "Online",
    start: "",
    end: "",
    coursework: ["Statistics", "Programming", "Machine learning", "Data analysis"],
    note: "Explored statistics, programming, and machine learning through data science coursework and early agricultural advisory project ideas.",
  },
  {
    slug: "mission-higher-secondary",
    degree: "Higher Secondary (PCM)",
    institution: "Mission English Higher Secondary School",
    location: "Seoni, India",
    start: "2019",
    end: "2020",
    grade: "78.2%",
    coursework: [
      "Physics",
      "Chemistry",
      "Mathematics",
      "English",
      "Computer Science",
    ],
  },
];
