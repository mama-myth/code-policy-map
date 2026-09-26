import sqlite3
import os
import subprocess

def query_user(user_input):
    conn = sqlite3.connect("app.db")
    cursor = conn.cursor()
    # UNSAFE: SQL Injection via string formatting (SEC-INJ-001)
    cursor.execute(f"SELECT * FROM users WHERE username = '{user_input}'")

def ping_host(host_address):
    # UNSAFE: Command Injection via shell execution (SEC-INJ-002)
    os.system("ping -c 1 " + host_address)
    subprocess.call("ping -c 1 " + host_address, shell=True)
