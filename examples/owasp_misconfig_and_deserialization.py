import pickle
import yaml
from flask import Flask

app = Flask(__name__)

# UNSAFE: Debug Mode Enabled in Framework (SEC-CFG-001)
DEBUG = True

def load_payload(raw_stream):
    # UNSAFE: Insecure Object Deserialization via pickle (SEC-DES-001)
    obj = pickle.loads(raw_stream)
    # UNSAFE: Insecure Object Deserialization via unsafe PyYAML loader (SEC-DES-001)
    data = yaml.load(raw_stream, Loader=yaml.Loader)
    return obj, data

if __name__ == "__main__":
    app.run(debug=True)
