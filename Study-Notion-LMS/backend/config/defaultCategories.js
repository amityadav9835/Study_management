const Category = require("../models/category");

const defaultCategories = async () => {
  try {
    const count = await Category.countDocuments();

    // Only insert if empty
    if (count === 0) {
      await Category.insertMany([
        {
          name: "Web Development",
          description: "Frontend + Backend development",
        },
        {
          name: "Data Structures",
          description: "Problem solving and algorithms",
        },
        {
          name: "Machine Learning",
          description: "AI and ML concepts",
        },
        {
          name: "Mobile Development",
          description: "Android & iOS apps",
        },
        {
          name: "Cloud Computing",
          description: "AWS, Azure, DevOps",
        },
      ]);

      console.log("Default categories inserted");
    } else {
      console.log("Categories already exist");
    }
  } catch (error) {
    console.log("Error inserting default categories:", error);
  }
};

module.exports = defaultCategories;
