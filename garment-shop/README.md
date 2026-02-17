# Parini — Clothing Shop (Python/Flask, no JavaScript)

Python-only clothing shop. All behavior is server-side: **no .js files**. Flask handles routing, session cart/wishlist, filters, search, and checkout via forms and full-page requests.

## Setup

1. Create a virtual environment (recommended):

   ```bash
   python3 -m venv venv
   source venv/bin/activate   # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```
   (On some systems use `pip3`.)

## Run

```bash
python app.py
```
(Or `python3 app.py`.)

Then open **http://localhost:3000** in your browser.

To use a different port:

```bash
PORT=5000 python app.py
```

## Project structure

- **`app.py`** — Flask app: product/category data, session cart and wishlist, all routes (index, product detail, add to cart, cart page, update/remove cart, wishlist toggle, checkout, newsletter, login).
- **`templates/`** — Jinja2 templates only (no script tags): `base.html`, `index.html`, `product.html`, `cart.html`, `checkout.html`, `login.html`.
- **`static/styles.css`** — Styles. No JavaScript in the project.

## Features

- **Shop**: Filter by category, min/max price, and search (GET form in header and filters on shop section).
- **Product page**: Size, color, quantity; Add to Cart and Add/Remove Wishlist (POST forms).
- **Cart page**: List items, change quantity or remove (POST); link to Checkout.
- **Checkout**: Shipping form (POST); order confirmation and cart cleared.
- **Account**: Login page (display-only message).
- Cart and wishlist are stored in the **session** (server-side).
