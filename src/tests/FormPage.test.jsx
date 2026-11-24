import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import FormPage from "../components/FormPage";
import { mockFetch, renderWith } from "./helpers";

function ui() {
  return renderWith(
    <Routes>
      <Route path="/menu/new" element={<FormPage />} />
      <Route path="/menu" element={<p>MENU PAGE</p>} />
    </Routes>,
    "/menu/new"
  );
}

test("shows validation errors for an empty form and does not POST", async () => {
  const fetchMock = mockFetch();
  render(ui());
  await userEvent.click(screen.getByRole("button", { name: /add product/i }));
  expect(screen.getByText("Name is required")).toBeInTheDocument();
  expect(screen.getByText("Enter a price greater than 0")).toBeInTheDocument();
  expect(fetchMock.mock.calls.some(([, o]) => o?.method === "POST")).toBe(false);
});

test("valid submit POSTs the product and redirects to /menu", async () => {
  const fetchMock = mockFetch();
  render(ui());
  await userEvent.type(screen.getByLabelText("Product Name"), "Air Test");
  await userEvent.type(screen.getByLabelText("Product Description"), "Nice shoe");
  await userEvent.type(screen.getByLabelText("Product Category"), "Running");
  await userEvent.type(screen.getByLabelText("Sell Price"), "99.5");
  await userEvent.click(screen.getByRole("button", { name: /add product/i }));

  await waitFor(() => expect(screen.getByText("MENU PAGE")).toBeInTheDocument());
  const post = fetchMock.mock.calls.find(([, o]) => o?.method === "POST");
  expect(JSON.parse(post[1].body)).toMatchObject({ name: "Air Test", category: "Running", price: 99.5 });
});
