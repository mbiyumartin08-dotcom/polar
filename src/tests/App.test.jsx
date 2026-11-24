import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { mockFetch } from "./helpers";

beforeEach(() => mockFetch());

function at(route) {
  render(<MemoryRouter initialEntries={[route]}><App /></MemoryRouter>);
}

test("unknown route shows the 404 page", () => {
  at("/nope");
  expect(screen.getByText("404")).toBeInTheDocument();
});

test("home route shows the landing page", () => {
  at("/");
  expect(screen.getByRole("heading", { name: /specialty coffee/i })).toBeInTheDocument();
});

test("/menu/new shows the add product form, not a product detail", () => {
  at("/menu/new");
  expect(screen.getByRole("heading", { name: "Add New Product" })).toBeInTheDocument();
});
