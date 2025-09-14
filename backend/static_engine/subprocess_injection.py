import subprocess

def run_ls(path):
    command = "ls " + path
    subprocess.call(command, shell=True)
