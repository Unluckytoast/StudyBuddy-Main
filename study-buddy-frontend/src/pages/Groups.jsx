import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../style/Groups.css";
import BackButton from "../components/BackButton"; // Import BackButton

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState({ name: "", description: "" });
  const [newMember, setNewMember] = useState({ groupId: "", userId: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const userId = JSON.parse(atob(localStorage.getItem("token").split(".")[1])).id;

  // Fetch groups for the logged-in user
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get(`/groups/user/${userId}`); // Fetch groups for the logged-in user
        setGroups(response.data);
      } catch (err) {
        console.error("Error fetching groups:", err);
        setError("Failed to fetch groups.");
      }
    };
    fetchGroups();
  }, [userId]);

  // Handle creating a new group
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newGroup.name || !newGroup.description) {
      setError("Both name and description are required.");
      return;
    }

    try {
      const response = await api.post("/groups", {
        name: newGroup.name,
        description: newGroup.description,
        creator_id: userId, // Pass the logged-in user's ID as creator_id
      });

      // Display the group ID in a popup window
      window.alert(`Group created successfully! Group ID: ${response.data.id}`);

      setGroups((prev) => [...prev, response.data]);
      setNewGroup({ name: "", description: "" });
      setSuccess("Group created successfully!");
    } catch (err) {
      console.error("Error creating group:", err);
      setError("Failed to create group.");
    }
  };

  // Handle adding a new member to a group
  const handleAddMember = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newMember.groupId || !newMember.userId) {
      setError("Both group ID and user ID are required.");
      return;
    }

    try {
      await api.post("/members", {
        group_id: newMember.groupId,
        user_id: newMember.userId,
      });
      setNewMember({ groupId: "", userId: "" });
      setSuccess("Member added successfully!");
    } catch (err) {
      console.error("Error adding member:", err);
      setError("Failed to add member.");
    }
  };

  return (
    <div className="groups-container">
      <BackButton /> {/* Use the BackButton component */}

      <h2>Groups</h2>

      {/* New Group Form */}
      <div className="create-group">
        <h3>Create New Group</h3>
        <form onSubmit={handleCreateGroup}>
          <input
            type="text"
            placeholder="Enter group name"
            value={newGroup.name}
            onChange={(e) =>
              setNewGroup((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
          <input
            type="text"
            placeholder="Enter group description"
            value={newGroup.description}
            onChange={(e) =>
              setNewGroup((prev) => ({ ...prev, description: e.target.value }))
            }
            required
          />
          <button type="submit">Create Group</button>
        </form>
      </div>

      {/* Add Member Form */}
      <div className="add-member">
        <h3>Add Member to Group</h3>
        <form onSubmit={handleAddMember}>
          <input
            type="text"
            placeholder="Enter group ID"
            value={newMember.groupId}
            onChange={(e) =>
              setNewMember((prev) => ({ ...prev, groupId: e.target.value }))
            }
            required
          />
          <input
            type="text"
            placeholder="Enter user ID"
            value={newMember.userId}
            onChange={(e) =>
              setNewMember((prev) => ({ ...prev, userId: e.target.value }))
            }
            required
          />
          <button type="submit">Add Member</button>
        </form>
      </div>

      {/* Group List */}
      <div className="group-list">
        <h3>Your Groups</h3>
        {groups.length === 0 ? (
          <p>No groups found.</p>
        ) : (
          <ul>
            {groups.map((group) => (
              <li key={group.id} className="group-item">
                <strong>Name:</strong> {group.name} <br />
                <strong>Description:</strong> {group.description}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default Groups;