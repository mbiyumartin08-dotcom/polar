# Polar

Polar is a React application built with Vite. Its product entry form is available at `/menu/new` and is implemented in [src/components/FormPage.jsx](./src/components/FormPage.jsx).

## FormPage: Add a Product

The FormPage lets a store user create a product, optionally save it as a draft, and see a simple preview before submitting. It is designed to run within the app's router and shared products provider.

### Product details

The form collects:

- **Name and description:** product name, optional tag, and description.
- **Pricing:** cost price, selling price, discount, and minimum order quantity. Prices use Ksh; discount choices are 0%, 5%, 10%, 15%, and 20%.
- **Category:** category and optional sub-category. Existing product categories and sub-categories are offered as suggestions, and users can enter new values.
- **Image:** an optional image file. Files larger than 500 KB are rejected; a valid image is previewed in the form.

As the user enters a name and selling price, the preview displays the product name and price after the selected discount.

### Validation

Submitting **Add Product** checks that:

- The name, description, and category are not blank.
- The selling price is a number greater than zero.
- An entered cost price is a valid, non-negative number.
- The minimum order quantity is at least one.

Validation messages are shown beside the corresponding fields. An invalid form is not sent to the server.

**Save Draft** uses the same form but only requires a product name. Draft products are submitted with `draft: true`; regular submissions use `draft: false`.

### Saving and navigation

The form sends a `POST` request to the products endpoint configured in [src/api.js](./src/api.js). Numeric values are converted to numbers before submission; an empty cost price is sent as `null`. The product payload also includes the image data, a default stock value of 20, and the draft status.

While the request is in progress, the save buttons are disabled and the primary button displays **Saving...**. If the request fails, an error message appears in the form. After a successful save, the shared product list is refreshed and the user is taken to `/menu`. **Back to Menu** returns to the menu without submitting. **Schedule** is currently disabled because scheduling has not been implemented.

### Tests

FormPage tests are in [src/tests/FormPage.test.jsx](./src/tests/FormPage.test.jsx). They cover required-field validation (and confirm invalid submissions do not POST) and a successful product submission that redirects to the menu.
