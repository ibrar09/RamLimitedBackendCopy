// services/cvService.js

import db from "../models/Index.js"; // all lowercase

const CV = db.CV;

class CVService {
  // CREATE NEW CV ENTRY
  static async createCV(data) {
    try {
      const cv = await CV.create(data);
      return cv;
    } catch (error) {
      throw error;
    }
  }

  // GET ALL CVs
  static async getAllCVs() {
    try {
      const cvs = await CV.findAll({
        order: [["created_at", "DESC"]],
      });
      return cvs;
    } catch (error) {
      throw error;
    }
  }

  // GET CV BY ID
  static async getCVById(id) {
    try {
      const cv = await CV.findByPk(id);
      return cv;
    } catch (error) {
      throw error;
    }
  }

  // UPDATE CV BY ID
  static async updateCV(id, data) {
    try {
      const cv = await CV.findByPk(id);
      if (!cv) return null;

      await cv.update(data);
      return cv;
    } catch (error) {
      throw error;
    }
  }

  // DELETE CV
  static async deleteCV(id) {
    try {
      const cv = await CV.findByPk(id);
      if (!cv) return null;

      await cv.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default CVService;
