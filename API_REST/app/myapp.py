from flask import Flask
from .extensions import api,db
from .views import ns

app = Flask(__name__)

import os
# initialisation de la BD
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
	'DATABASE_URL',
	'mysql+pymysql://joubert:joubert@servinfo-maria:3306/DBjoubert?charset=utf8mb4')

# initialisation de restx
api.init_app(app)
db.init_app(app)
api.add_namespace(ns)