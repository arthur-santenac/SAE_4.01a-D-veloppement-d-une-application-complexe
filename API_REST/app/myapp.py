from flask import Flask
from flask_cors import CORS
from .extensions import api,db
from .views import ns

app = Flask(__name__)

CORS(app)

import os
# initialisation de la BD
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
	'DATABASE_URL',
	'mysql+pymysql://joubert:joubert@servinfo-maria:3306/DBjoubert?charset=utf8mb4')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# initialisation de restx
db.init_app(app)
api.init_app(app)

api.add_namespace(ns)