// Edward - Mwai - detail tests
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import MenuDetail from "../components/MenuDetail";
import { mockFetch, renderWith } from "./helpers";

function ui(id) {
  return renderWith(
    <Routes>
      <Route path="/menu/:id" element={<MenuDetail />} />
      <Route path="/menu" element={<p>MENU PAGE</p>} />
    </Routes>,
    `/menu/${id}`
  );
}

test("shows the product", async () => {
  mockFetch();
  render(ui(1));
  expect(await screen.findByRole("heading", { name: "Street Runner" })).toBeInTheDocument();
});

test("unknown id shows not found", async () => {
  mockFetch();
  render(ui(99));
  expect(await screen.findByText("Product not found")).toBeInTheDocument();
});

test("saving a new price sends PATCH with the price", async () => {
  const fetchMock = mockFetch();
  render(ui(1));
  const input = await screen.findByLabelText(/new price/i);
  await userEvent.clear(input);
  await userEvent.type(input, "65");
  await userEvent.click(screen.getByRole("button", { name: /save price/i }));
  await waitFor(() => {
    const patch = fetchMock.mock.calls.find(([, o]) => o?.method === "PATCH");
    expect(patch).toBeTruthy();
    expect(JSON.parse(patch[1].body)).toEqual({ price: 65 });
  });
});


test("delete asks for confirmation, sends DELETE and goes to /menu", async () => {
  const fetchMock = mockFetch();
  vi.spyOn(window, "confirm").mockReturnValue(true);
  render(ui(1));
  await userEvent.click(await screen.findByRole("button", { name: /delete product/i }));
  await waitFor(() => expect(screen.getByText("MENU PAGE")).toBeInTheDocument());
  expect(fetchMock.mock.calls.some(([, o]) => o?.method === "DELETE")).toBe(true);
});
