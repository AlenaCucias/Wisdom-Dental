from flask import Flask
from flask_cors import CORS
from patients import patients_blueprint
from staff import staff_blueprint
from feedback import feedback_blueprint
from admin import admin_blueprint
from common import common_blueprint

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Register blueprints
app.register_blueprint(patients_blueprint, url_prefix='/patients')
app.register_blueprint(staff_blueprint, url_prefix='/staff')
app.register_blueprint(feedback_blueprint, url_prefix='/feedback')
app.register_blueprint(admin_blueprint, url_prefix='/admin')
app.register_blueprint(common_blueprint, url_prefix='/common')

@app.route('/')
def index():
    return "Welcome to the Dental Clinic Management System API!"

if __name__ == '__main__':
    app.run(debug=True)