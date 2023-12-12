import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../helper/Helper";
const apiKey = process.env.REACT_APP_API_KEY;
const apiUrl = process.env.REACT_APP_API_URL;



const FormDataMERN = () => {
  // State variables to manage users, edit mode, edited user, modals, and user deletion
  const [users, setUsers] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editedUser, setEditedUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  // Add a state variable to track the profile picture file
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  

  // Effect to fetch user data from the server on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUsers();
  }, []); // Run this effect only once on component mount

  // Handle click to edit a user
  // Handle click to edit a user
  const handleEditClick = (user) => {
    setEditMode(user._id);
    setEditedUser({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      gender: user.gender,
    });
    setIsEditModalOpen(true);
    
    // Set the profile picture file to the current user's profile picture
    if (user.profilePicture) {
      setProfilePictureFile(user.profilePicture); // You might need to fetch the profile picture separately and set it here
    }
  };


  // Handle click to delete a user
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  // Handle input change in the edit modal
   const handleInputChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };


  // Handle click to save edits in the edit modal
  // const handleSaveClick = async () => {
  //   try {
  //     // Send a PUT request to update the user data on the server
  //     await axios.put(`http://localhost:5001/users/${editMode}`, editedUser);
  //     // Fetch the updated user list after editing
  //     // const response = await axios.get("http://localhost:5001/users");
  //     // setUsers(response.data);

  //     setEditMode(null);
  //     setEditedUser({
  //       firstName: "",
  //       lastName: "",
  //       email: "",
  //       gender: "",
  //     });
  //     setIsEditModalOpen(false);
  //   } catch (error) {
  //     console.error("Error updating user data:", error);
  //   }
  // };
  const handleSaveClick = async () => {
    try {
      const formData = new FormData();
      formData.append("profilePicture", profilePictureFile);
      // Add other fields to the form data
      formData.append("firstName", editedUser.firstName);
      formData.append("lastName", editedUser.lastName);
      formData.append("email", editedUser.email);
      formData.append("gender", editedUser.gender);

      // Send a PUT request with the form data
      await axios.put(`http://localhost:5001/users/${editMode}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Fetch the updated user list after editing
      const response = await axios.get("http://localhost:5001/users");
      setUsers(response.data);

      setEditMode(null);
      setEditedUser({
        firstName: "",
        lastName: "",
        email: "",
        gender: "",
      });
      setProfilePictureFile(null); // Reset profile picture file
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  // Handle profile picture change in the edit modal
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePictureFile(file);
    // Optionally, create a URL for the file to display a preview
    const imageUrl = URL.createObjectURL(file);
    setProfilePicturePreview(imageUrl);
  };

  // Handle click to confirm user deletion
  const handleDeleteConfirm = async () => {
    try {
      // Send a DELETE request to delete the user from the server
      await axios.delete(`${BASE_URL}/users/${userToDelete._id}`);
      // Fetch the updated user list after deleting
      const response = await axios.get(`${BASE_URL}/users`);
      setUsers(response.data);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div>
      <h2>User List</h2>
      <h3>{apiKey}</h3>
      <h3>{apiUrl}</h3>
      <ul>
        {/* // Inside the map function where you render user data */}
        {users.map((user) => (
          <li key={user._id}>
            <p>First Name: {user.firstName}</p>
            <p>Last Name: {user.lastName}</p>
            <p>Email: {user.email}</p>
            <p>Gender: {user.gender}</p>
            {user.profilePicture && (
              <img
                src={`${BASE_URL}/${user.profilePicture}`}
                alt={`${user.firstName}'s Profile`}
                style={{ width: "100px", height: "100px" }}
              />
            )}
            <button onClick={() => handleEditClick(user)}>Edit</button>
            <button onClick={() => handleDeleteClick(user)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit User</h2>
            <p>
              First Name:{" "}
              <input
                type="text"
                name="firstName"
                value={editedUser.firstName}
                onChange={handleInputChange}
              />
            </p>
            <p>
              Last Name:{" "}
              <input
                type="text"
                name="lastName"
                value={editedUser.lastName}
                onChange={handleInputChange}
              />
            </p>
            <p>
              Email:{" "}
              <input
                type="text"
                name="email"
                value={editedUser.email}
                onChange={handleInputChange}
              />
            </p>
            <p>
              Gender:
              <label>
                <input
                  type="checkbox"
                  name="gender"
                  value="male"
                  checked={editedUser.gender === "male"}
                  onChange={handleInputChange}
                />
                Male
              </label>
              <label>
                <input
                  type="checkbox"
                  name="gender"
                  value="female"
                  checked={editedUser.gender === "female"}
                  onChange={handleInputChange}
                />
                Female
              </label>
            </p>
            <p>
              Profile Picture:{" "}
              <input
                type="file"
                name="profilePicture"
                accept="image/*"
                onChange={(e) => handleProfilePictureChange(e)}
              />
            </p>

            <button onClick={handleSaveClick}>Save</button>
            <button onClick={() => setIsEditModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this user?</p>
            <button onClick={handleDeleteConfirm}>Yes</button>
            <button onClick={() => setIsDeleteModalOpen(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormDataMERN;
