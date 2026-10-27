import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api/projects";

export const projectService = {
  // Get all projects
  async getAllProjects() {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch projects from server."
      );
    }
  },

  // Get project by ID
  async getProjectById(id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error ||
        error.message ||
        `Failed to fetch project #${id}.`
      );
    }
  },

  // Create a new project
  async createProject(projectData) {
    try {
      const response = await axios.post(API_BASE_URL, {
        name: projectData.name?.trim(),
        description: projectData.description?.trim() || "",
        startDate: projectData.startDate,
        deadline: projectData.deadline,
        status: projectData.status || "Not Started",
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error ||
        error.message ||
        "Failed to create project."
      );
    }
  },

  // Update an existing project
  async updateProject(id, projectData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, {
        name: projectData.name?.trim(),
        description: projectData.description?.trim() || "",
        startDate: projectData.startDate,
        deadline: projectData.deadline,
        status: projectData.status,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error ||
        error.message ||
        "Failed to update project."
      );
    }
  },

  // Delete a project
  async deleteProject(id) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error ||
        error.message ||
        "Failed to delete project."
      );
    }
  },
};

