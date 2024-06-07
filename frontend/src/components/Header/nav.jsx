import React, { useState, useRef, useEffect } from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  FormLabel,
  Avatar,
  Stack,
  WrapItem,
  Box,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import "bootstrap/dist/css/bootstrap.min.css";
import "boxicons/css/boxicons.min.css";
import "../../Styles/nav.css";
import CourseDetail from "../Course/courseDeatils";

function CustomNav() {
  const [expanded, setExpanded] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    skills: "",
    gender: "",
    profilePhoto: null,
    courses: [], // Initialize courses as an empty array
  });

  const firstField = useRef();

  const toggleNavbar = () => {
    setExpanded(!expanded);
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch("http://localhost:5001/edit-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile data");
      }

      const data = await response.json();
      setUserData(data);
      window.location.href = "/profile";
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const logOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch("http://localhost:5001/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch profile data"
        );
      }

      const userData = await response.json();
      const skills = userData.skills.map((skill) =>
        skill.replace(/[\[\]"]/g, "")
      );

      let formattedSkills = "";
      skills.forEach((skill, index) => {
        formattedSkills += skill + (index % 4 === 3 ? "\n" : "     ");
      });

      // Set user data including enrollment details in state
      setUserData({
        ...userData,
        skills: formattedSkills,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUserProfile();
    }
  }, [isOpen]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const cleanSkills = (skills) => {
    return skills
      .split(/\s{2,}|\n/)
      .filter((skill) => skill.trim())
      .map((skill) => skill.trim());
  };

  return (
    <>
      <Navbar
        expand="lg"
        expanded={expanded}
        className={`navbar ${expanded ? "expanded" : ""}`}
      >
        <Container>
          <Navbar.Brand className="nav-brand" href="#home">
            <img
              src="../../../Images/logo.png"
              alt="Logo"
              className="d-inline-block align-top"
            />
            Brain
            <span
              style={{ color: "#7eec6d", margin: "0 2.3px", fontSize: "23px" }}
            >
              BOOST
            </span>
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            onClick={toggleNavbar}
          />
          <Navbar.Collapse
            id="responsive-navbar-nav"
            className="justify-content-center"
          >
            <Nav
              className={`me-auto navLink-div ${expanded ? "expanded" : ""}`}
            >
              <Nav.Link href="#about">About</Nav.Link>
              <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#course">Courses</Nav.Link>
              <Nav.Link href="#contact">Contact</Nav.Link>
            </Nav>
            <Nav>
              {userData.profilePhoto && (
                <Nav.Item>
                  <WrapItem>
                    <Avatar
                      name={userData.firstName}
                      onClick={onOpen}
                      src={`http://localhost:5001/${userData.profilePhoto}`}
                      alt="Profile"
                      style={{ cursor: "pointer", border: "3px solid #7eec6d" }}
                    />
                  </WrapItem>
                </Nav.Item>
              )}
            </Nav>
          </Navbar.Collapse>
          <i
            className={`bx bx-menu text-white ham ${expanded ? "open" : ""}`}
            onClick={toggleNavbar}
          ></i>
        </Container>
      </Navbar>
      <Drawer
        isOpen={isOpen}
        placement="right"
        initialFocusRef={firstField}
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">My Profile</DrawerHeader>
          <DrawerBody>
            <Stack spacing="24px">
              <Box>
                <FormLabel htmlFor="username">Name</FormLabel>
                <Text>
                  {userData.firstName} {userData.lastName}
                </Text>
              </Box>
              <Box>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Text>{userData.email}</Text>
              </Box>
              <Box>
                <FormLabel htmlFor="phone">Phone</FormLabel>
                <Text>{userData.phone}</Text>
              </Box>
              <Box>
                <FormLabel htmlFor="gender">Gender</FormLabel>
                <Text>{userData.gender}</Text>
              </Box>
              <Box>
                <FormLabel htmlFor="skills">Skills</FormLabel>
                <div className="skills-list">
                  {cleanSkills(userData.skills).map((skill, idx) => (
                    <span key={idx} className="skill-item">
                      {skill.toUpperCase()}
                    </span>
                  ))}
                </div>
              </Box>
              <Box>
                <FormLabel htmlFor="courses">Enrolled Courses</FormLabel>
                <div className="courses-list">
                  {userData.courses.map((course, idx) => (
                    <div key={idx} className="course-item  text-center">
                      <Text>
                        {course.courseName} - ₹{course.coursePrice}
                      </Text>
                    </div>
                  ))}
                </div>
              </Box>
            </Stack>
          </DrawerBody>
          <DrawerFooter borderTopWidth="1px">
            <Button variant="danger" className="m-2" onClick={logOut}>
              Log Out
            </Button>
            <Button variant="primary" onClick={handleProfile}>
              Edit Profile
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default CustomNav;
