"""
Thread & Weave — Dress Shop (Flask, Python only — no JavaScript)
All behavior is server-side: forms, session cart/wishlist, filters, checkout.
"""
import os
from flask import Flask, render_template, request, redirect, url_for, session, flash

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-change-in-production")

# Product and category data
PRODUCTS = [
    {"id": 1, "name": "Midi Slip Dress", "category": "dresses", "price": 145, "sizes": ["XS", "S", "M", "L"], "colors": ["Blush", "Black", "Ivory"], "image": "dress1"},
    {"id": 2, "name": "Floral Maxi Dress", "category": "dresses", "price": 168, "sizes": ["S", "M", "L"], "colors": ["Navy", "Sage"], "image": "dress2"},
    {"id": 3, "name": "Wrap Midi Dress", "category": "dresses", "price": 125, "sizes": ["XS", "S", "M", "L", "XL"], "colors": ["Terracotta", "Black"], "image": "dress3"},
    {"id": 4, "name": "Evening Gown", "category": "dresses", "price": 289, "sizes": ["S", "M", "L"], "colors": ["Black", "Emerald"], "image": "dress4"},
    {"id": 5, "name": "Shirt Dress", "category": "dresses", "price": 98, "sizes": ["XS", "S", "M", "L"], "colors": ["White", "Striped"], "image": "dress5"},
    {"id": 6, "name": "Organic Cotton Tee", "category": "tops", "price": 42, "sizes": ["XS", "S", "M", "L", "XL"], "colors": ["White", "Black", "Oat"], "image": "top1"},
    {"id": 7, "name": "Linen Overshirt", "category": "tops", "price": 128, "sizes": ["S", "M", "L"], "colors": ["Beige", "Olive"], "image": "top2"},
    {"id": 8, "name": "Silk Blouse", "category": "tops", "price": 89, "sizes": ["XS", "S", "M", "L"], "colors": ["Blush", "White"], "image": "top3"},
    {"id": 9, "name": "Wide-Leg Trousers", "category": "bottoms", "price": 96, "sizes": ["XS", "S", "M", "L"], "colors": ["Black", "Cream"], "image": "bottom1"},
    {"id": 10, "name": "High-Waist Skirt", "category": "bottoms", "price": 72, "sizes": ["S", "M", "L"], "colors": ["Plaid", "Black"], "image": "bottom2"},
    {"id": 11, "name": "Linen Trousers", "category": "bottoms", "price": 88, "sizes": ["S", "M", "L"], "colors": ["White", "Navy"], "image": "bottom3"},
    {"id": 12, "name": "Leather Crossbody", "category": "accessories", "price": 165, "sizes": ["One Size"], "colors": ["Tan", "Black"], "image": "acc1"},
    {"id": 13, "name": "Wool Scarf", "category": "accessories", "price": 58, "sizes": ["One Size"], "colors": ["Camel", "Grey"], "image": "acc2"},
    {"id": 14, "name": "Straw Tote", "category": "accessories", "price": 78, "sizes": ["One Size"], "colors": ["Natural"], "image": "acc3"},
    {"id": 15, "name": "Cocktail Dress", "category": "dresses", "price": 195, "sizes": ["XS", "S", "M", "L"], "colors": ["Red", "Black"], "image": "dress6"},
    {"id": 16, "name": "Casual Jumpsuit", "category": "dresses", "price": 112, "sizes": ["S", "M", "L"], "colors": ["Denim", "Black"], "image": "jumpsuit1"},
]

CATEGORIES = [
    {"id": "all", "label": "All"},
    {"id": "dresses", "label": "Dresses"},
    {"id": "tops", "label": "Tops"},
    {"id": "bottoms", "label": "Bottoms"},
    {"id": "accessories", "label": "Accessories"},
]

IMAGE_CLASSES = {
    "dress1": "img-dress1", "dress2": "img-dress2", "dress3": "img-dress3", "dress4": "img-dress4",
    "dress5": "img-dress5", "dress6": "img-dress6", "top1": "img-top1", "top2": "img-top2", "top3": "img-top3",
    "bottom1": "img-bottom1", "bottom2": "img-bottom2", "bottom3": "img-bottom3",
    "acc1": "img-acc1", "acc2": "img-acc2", "acc3": "img-acc3", "jumpsuit1": "img-jumpsuit1",
}


def get_product(pid):
    for p in PRODUCTS:
        if p["id"] == pid:
            return p
    return None


def get_filtered_products(category="all", min_price=None, max_price=None, search=""):
    out = []
    for p in PRODUCTS:
        if category != "all" and p["category"] != category:
            continue
        if min_price is not None and p["price"] < min_price:
            continue
        if max_price is not None and p["price"] > max_price:
            continue
        if search:
            q = search.lower()
            if q not in p["name"].lower() and q not in p["category"].lower():
                continue
        out.append(p)
    return out


def get_cart():
    return session.get("cart", [])


def get_cart_total():
    return sum(item["price"] * item["quantity"] for item in get_cart())


def get_cart_count():
    return sum(item["quantity"] for item in get_cart())


def get_wishlist():
    return session.get("wishlist", [])


def in_wishlist(pid):
    return pid in get_wishlist()


@app.context_processor
def inject_cart_count():
    return {"cart_count": get_cart_count()}


@app.route("/")
def index():
    category = request.args.get("category", "all")
    min_price = request.args.get("minPrice", type=lambda x: int(x) if x else None)
    max_price = request.args.get("maxPrice", type=lambda x: int(x) if x else None)
    search = request.args.get("search", "").strip()
    products = get_filtered_products(category, min_price, max_price, search)
    featured = PRODUCTS[:8]
    return render_template(
        "index.html",
        products=products,
        featured=featured,
        categories=CATEGORIES,
        image_classes=IMAGE_CLASSES,
        cart_count=get_cart_count(),
        wishlist=get_wishlist(),
        current_category=category,
        current_min_price=request.args.get("minPrice", ""),
        current_max_price=request.args.get("maxPrice", ""),
        current_search=search,
    )


@app.route("/product/<int:pid>")
def product_detail(pid):
    product = get_product(pid)
    if not product:
        flash("Product not found.")
        return redirect(url_for("index"))
    img_class = IMAGE_CLASSES.get(product["image"], "")
    return render_template(
        "product.html",
        product=product,
        image_class=img_class,
        cart_count=get_cart_count(),
        in_wishlist=in_wishlist(pid),
    )


@app.route("/cart/add", methods=["POST"])
def add_to_cart():
    pid = request.form.get("product_id", type=int)
    quantity = request.form.get("quantity", default=1, type=lambda x: max(1, int(x) or 1))
    size = request.form.get("size", "").strip()
    color = request.form.get("color", "").strip()
    product = get_product(pid)
    if not product:
        flash("Product not found.")
        return redirect(url_for("index"))
    size = size or product["sizes"][0]
    color = color or product["colors"][0]
    cart = list(get_cart())
    found = False
    for item in cart:
        if item["id"] == pid and item["size"] == size and item["color"] == color:
            item["quantity"] += quantity
            found = True
            break
    if not found:
        cart.append({
            "id": product["id"],
            "name": product["name"],
            "price": product["price"],
            "quantity": quantity,
            "size": size,
            "color": color,
            "image": product["image"],
        })
    session["cart"] = cart
    flash(f"Added to cart: {product['name']}")
    next_url = request.form.get("next") or request.referrer or url_for("index")
    return redirect(next_url)


@app.route("/cart")
def cart_page():
    cart = get_cart()
    total = get_cart_total()
    return render_template(
        "cart.html",
        cart=cart,
        total=total,
        image_classes=IMAGE_CLASSES,
        cart_count=get_cart_count(),
    )


@app.route("/cart/update", methods=["POST"])
def update_cart():
    index = request.form.get("index", type=int)
    action = request.form.get("action")  # "plus", "minus", "remove"
    cart = list(get_cart())
    if 0 <= index < len(cart):
        if action == "remove":
            cart.pop(index)
        elif action == "plus":
            cart[index]["quantity"] += 1
        elif action == "minus":
            cart[index]["quantity"] = max(1, cart[index]["quantity"] - 1)
    session["cart"] = cart
    return redirect(url_for("cart_page"))


@app.route("/wishlist/toggle", methods=["POST"])
def wishlist_toggle():
    pid = request.form.get("product_id", type=int)
    if not get_product(pid):
        return redirect(url_for("index"))
    wishlist = list(get_wishlist())
    if pid in wishlist:
        wishlist.remove(pid)
    else:
        wishlist.append(pid)
    session["wishlist"] = wishlist
    next_url = request.form.get("next") or request.referrer or url_for("index")
    return redirect(next_url)


@app.route("/checkout", methods=["GET", "POST"])
def checkout():
    cart = get_cart()
    if not cart:
        return redirect(url_for("cart_page"))
    total = get_cart_total()
    if request.method == "POST":
        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip()
        address = request.form.get("address", "").strip()
        city = request.form.get("city", "").strip()
        zip_code = request.form.get("zip", "").strip()
        if not all([name, email, address, city, zip_code]):
            flash("Please fill in all shipping fields.")
            return render_template("checkout.html", cart=cart, total=total, cart_count=get_cart_count())
        session["cart"] = []
        flash(f"Thank you! Your order (${total:.2f}) has been placed. We'll send confirmation to {email}.")
        return redirect(url_for("index"))
    return render_template("checkout.html", cart=cart, total=total, cart_count=get_cart_count())


@app.route("/newsletter", methods=["POST"])
def newsletter():
    flash("Thanks for subscribing!")
    return redirect(url_for("index") + "#contact")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        flash("Login is for display only. In a real site this would sign you in.")
        return redirect(url_for("index"))
    return render_template("login.html")


if __name__ == "__main__":
    import socket
    preferred = int(os.environ.get("PORT", 3000))
    port = preferred
    for _ in range(10):
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.bind(("", port))
            sock.close()
            break
        except OSError:
            port += 1
    else:
        print("No available port between {} and {}.".format(preferred, port - 1))
        raise SystemExit(1)
    print("Thread & Weave running at http://localhost:{}".format(port))
    print("Press Ctrl+C to stop.")
    app.run(host="0.0.0.0", port=port, debug=True)
