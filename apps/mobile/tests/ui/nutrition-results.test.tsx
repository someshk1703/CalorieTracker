import { fireEvent, render, screen } from "@testing-library/react-native";
import NutritionResultsScreen from "../../app/meal-results";

describe("Nutrition Results screen", () => {
  it("shows macros, allows quantity changes, and exposes correction/save actions", () => {
    render(<NutritionResultsScreen />);

    expect(screen.getByText(/calories/i)).toBeTruthy();
    expect(screen.getByText(/protein/i)).toBeTruthy();
    expect(screen.getByText(/carbs/i)).toBeTruthy();
    expect(screen.getByText(/fat/i)).toBeTruthy();

    fireEvent.press(screen.getByLabelText("Increase serving quantity"));
    expect(screen.getByText(/2 servings/i)).toBeTruthy();

    expect(screen.getByText("Fix Results")).toBeTruthy();
    expect(screen.getByText("Done")).toBeTruthy();
  });
});