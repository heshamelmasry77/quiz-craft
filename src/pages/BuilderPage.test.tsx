import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

function BuilderPage() {
  return (
    <section>
      <h1>Accessible Quiz Builder</h1>
    </section>
  );
}

test("renders builder headline", () => {
  render(<BuilderPage />);
  expect(screen.getByText(/Accessible Quiz Builder/i)).toBeInTheDocument();
});
