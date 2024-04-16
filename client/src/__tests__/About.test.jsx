import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
// import App from "../App";
import About from "../pages/About"

describe("App", () => {
  test("renders About component", async () => {
    render(<About />);
    expect(screen.getByText('This is the about page.')).toBeInTheDocument();
  });
});