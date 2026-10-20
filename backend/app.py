"""Simple login API built with Flask.

Run:  python app.py   (listens on http://localhost:5000)
"""
import secrets
from datetime import datetime, timedelta, timezone

from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash

app = Flask(__name__)
CORS(app, origins=["http://localhost:4200"])

# Demo user store. Passwords are stored only as hashes.
# Replace with a real database in production.
USERS = {
    "admin": {"name": "Administrator", "password_hash": generate_password_hash("admin123")},
    "manish": {"name": "Manish Sharma", "password_hash": generate_password_hash("password@1")},
}

# In-memory session tokens: token -> {"user": login_id, "expires": datetime}
SESSIONS = {}
TOKEN_TTL = timedelta(hours=1)


def _current_user():
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return None
    session = SESSIONS.get(auth.removeprefix("Bearer ").strip())
    if not session or session["expires"] < datetime.now(timezone.utc):
        return None
    return session["user"]


@app.post("/api/login")
def login():
    data = request.get_json(silent=True) or {}
    login_id = str(data.get("loginId", "")).strip()
    password = str(data.get("password", ""))

    if not login_id or not password:
        return jsonify(success=False, message="Login ID and password are required."), 400

    user = USERS.get(login_id.lower())
    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify(success=False, message="Invalid login ID or password."), 401

    token = secrets.token_urlsafe(32)
    SESSIONS[token] = {"user": login_id.lower(), "expires": datetime.now(timezone.utc) + TOKEN_TTL}
    return jsonify(success=True, message="Login successful.", token=token,
                   user={"loginId": login_id.lower(), "name": user["name"]})


@app.get("/api/me")
def me():
    login_id = _current_user()
    if not login_id:
        return jsonify(success=False, message="Not authenticated."), 401
    return jsonify(success=True, user={"loginId": login_id, "name": USERS[login_id]["name"]})


@app.post("/api/logout")
def logout():
    auth = request.headers.get("Authorization", "")
    SESSIONS.pop(auth.removeprefix("Bearer ").strip(), None)
    return jsonify(success=True, message="Logged out.")


@app.get("/api/health")
def health():
    return jsonify(status="ok")


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
