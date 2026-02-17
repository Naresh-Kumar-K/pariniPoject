# Parini Clothing Shop

This is a small Flask project made for college practice.
It is a clothing shop website with cart and checkout flow.

## Tech used

- Python
- Flask
- HTML + CSS

## How to run

1. (Optional) create venv
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. Install requirements
   ```bash
   pip install -r requirements.txt
   ```

3. Start app
   ```bash
   python app.py
   ```

Then open `http://localhost:3000`

## Features I added

- Signup flow (session based)
- Product listing with categories
- Search and price filter
- Product details page
- Add to cart / update cart
- Wishlist toggle
- Checkout form

## Notes

- No database used, product data is in `app.py`
- Cart/wishlist stored in Flask session
- This is a mini project, not production ready
