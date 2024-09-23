from flask import Flask
from datetime import datetime
from werkzeug.middleware.proxy_fix import ProxyFix
from .api import api_bp

app = Flask(__name__)
app.register_blueprint(api_bp, url_prefix='/api')
app.wsgi_app = ProxyFix(app.wsgi_app,  x_for=1, x_proto=1, x_host=1, x_prefix=1)
