const Budget = require("spent/db/models/Budget");
const Category = require("spent/db/models/Category");

const importBudgets = async (budgets, plan) => {
  for (const budget of budgets) {
    const [categoryName, name] = budget.name.split(" - ");

    const categoryData = { name: categoryName };

    const category = await Category.findOneAndUpdate(
      { name: categoryName },
      { name: categoryName, plan: plan.id },
      { new: true, upsert: true }
    );

    const budgetDoc = await Budget.create({
      ...budget,
      name: name,
      category: category.id,
      plan: plan.id
    });

    console.log(`Created budget group ${name}`);
  }
};

module.exports = importBudgets;
