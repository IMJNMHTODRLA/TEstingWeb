from flask import Flask, render_template, request, redirect, url_for, jsonify
import json
import os

app = Flask(__name__)

DATA_FILE = "data.json"

adminIp = ["192.168.219.105", ""]

def load_posts():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
            if isinstance(data, list):
                return data
            return []
        except json.JSONDecodeError:
            return []

def save_posts(posts):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)

@app.route("/")
def index():
    user_ip = request.remote_addr  # 사용자 IP를 가져옵니다.

    # 기본 게시물 리스트를 로드합니다.
    posts = load_posts()
    post_list = [{"id": post_id, "title": post[str(post_id)][0]["Title"]} for post_id, post in enumerate(posts)]

    # 관리자의 IP일 경우 alert 메시지를 반환
    admin_message = ""
    if user_ip in adminIp:
        admin_message = f"안녕하세요. 어드민, 당신의 IPv4 주소는 {user_ip} 입니다."

    # 게시물 리스트와 alert_message를 함께 전달
    return render_template("index.html", posts=post_list, admin_message=admin_message)

@app.route("/write", methods=["GET", "POST"])
def write():
    if request.method == "POST":
        title = request.form["title"]
        content = request.form["content"]
        posts = load_posts()
        new_post = {str(len(posts)): [{"Title": title, "Content": content, "Comments": []}]}
        posts.append(new_post)  # 리스트에 새로운 게시물 추가
        save_posts(posts)
        return redirect(url_for("index"))
    return render_template("write.html")

@app.route("/post/<int:post_id>", methods=["GET", "POST"])
def post(post_id):
    posts = load_posts()

    if request.method == "POST":
        comment = request.form["comment"]
        posts[post_id][str(post_id)][0]["Comments"].append(comment)
        save_posts(posts)

    post_data = posts[post_id][str(post_id)][0]
    return render_template("post.html", post=post_data)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
