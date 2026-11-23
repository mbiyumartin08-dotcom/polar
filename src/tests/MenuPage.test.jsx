import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MenuPage from "../components/MenuPage";
import { mockFetch, renderWith } from "./helpers";

beforeEach(() => mockFetch());

test("shows products from the API", async () => {
  render(renderWith(<MenuPage />, "/menu"));
  expect(await screen.findByText("Street Runner")).toBeInTheDocument();
  expect(screen.getByText("Court Classic")).toBeInTheDocument();
});

test("search filters the list", async () => {
  render(renderWith(<MenuPage />, "/menu"));
  await screen.findByText("Street Runner");
  await userEvent.type(screen.getByLabelText(/search products/i), "trail");
  expect(screen.getByText("Trail Blazer")).toBeInTheDocument();
  expect(screen.queryByText("Street Runner")).not.toBeInTheDocument();
});

test("category chip filters the list", async () => {
  render(renderWith(<MenuPage />, "/menu"));
  await screen.findByText("Street Runner");
  await userEvent.click(screen.getByRole("button", { name: /^Hiking/ }));
  expect(screen.getByText("Trail Blazer")).toBeInTheDocument();
  expect(screen.queryByText("Court Classic")).not.toBeInTheDocument();
});

test("adding a product puts it in the order and updates the total", async () => {
  render(renderWith(<MenuPage />, "/menu"));
  await screen.findByText("Court Classic");
  const addButtons = screen.getAllByRole("button", { name: "Add to Order" });
  await userEvent.click(addButtons[1]); // Court Classic, $74.50
  const panel = screen.getByRole("complementary", { name: /current order/i });
  expect(panel).toHaveTextContent("Court Classic");
  expect(panel).toHaveTextContent("$78.23"); // 74.50 + 5% tax
});

test("Place Order sends a POST to /orders", async () => {
  const fetchMock = mockFetch();
  render(renderWith(<MenuPage />, "/menu"));
  await screen.findByText("Court Classic");
  await userEvent.click(screen.getAllByRole("button", { name: "Add to Order" })[1]);
  await userEvent.click(screen.getByRole("button", { name: "Place Order" }));
  await screen.findByText(/placed/i);
  const post = fetchMock.mock.calls.find(([url, o]) => o?.method === "POST" && String(url).endsWith("/orders"));
  expect(JSON.parse(post[1].body)).toMatchObject({ status: "Pending", payment: "M-Pesa", customer: "Walk-in customer" });
});
