# datathon-2025

## Setting Up a Virtual Environment

This guide explains how to set up a Python virtual environment for both macOS and Windows.

### Prerequisites
- Install **Python (>=3.8, <=3.11.5)** from [Python's official website](https://www.python.org/downloads/)
- Install [pip](https://pip.pypa.io/en/stable/installation/)
- Ensure `pip` and `venv` are available in your system

**Check your Python version:**
```sh
python --version
```
If the output is outside the range **3.8 - 3.11.5**, install the correct version before proceeding.

---

## For macOS and Linux

### Step 1: Open a Terminal
Press `Command + Space` and search for "Terminal".

### Step 2: Navigate to the Project Directory
```sh
cd path/to/your/project
```

### Step 3: Create a Virtual Environment
```sh
python3 -m venv venv
```

### Step 4: Activate the Virtual Environment
```sh
source venv/bin/activate
```

You should see `(venv)` in your terminal, indicating the virtual environment is active.

### Step 5: Install Dependencies
```sh
pip install -r requirements.txt
```

---

## For Windows

### Step 1: Open Command Prompt or PowerShell
- Press `Win + R`, type `cmd`, and hit Enter.
- Alternatively, open PowerShell (`Win + X` → "Windows Terminal").

### Step 2: Navigate to the Project Directory
```cmd
cd path	o\your\project
```

### Step 3: Create a Virtual Environment
```cmd
python -m venv venv
```

### Step 4: Activate the Virtual Environment
For **Command Prompt**:
```cmd
venv\Scriptsctivate
```

For **PowerShell** (if Command Prompt doesn't work):
```powershell
venv\Scripts\Activate.ps1
```

*Note:* If you get a security error in PowerShell, run:
```powershell
Set-ExecutionPolicy Unrestricted -Scope Process
```
and then retry activating the virtual environment.

### Step 5: Install Dependencies
```cmd
pip install -r requirements.txt
```

---

## Deactivating the Virtual Environment
To deactivate the virtual environment, simply run:
```sh
deactivate
```

---

## Additional Notes
- Ensure you are using **Python 3.8 - 3.11.5** by checking:
  ```sh
  python --version
  ```
- If your Python version is incorrect, download the correct version from [Python's website](https://www.python.org/downloads/).
- Use `pip freeze > requirements.txt` to export installed packages.
- If you encounter issues, try updating `pip` with:
  ```sh
  python -m pip install --upgrade pip
  ```
- If Python is not found, ensure it is added to the system `PATH`.

---

# To view Network Graph

### **For WAMP (Windows)**
1. Move your project folder (`datathon-2025`) into WAMP's `www` directory:
   ```
   C:\wamp64\www\datathon-2025
   ```
2. Start WAMP Server and ensure the icon in the taskbar turns **green**.
3. Open a web browser and go to:
   ```
   http://localhost/datathon-2025/network_graph.html
   ```

---

### **For MAMP (Mac)**
1. Move your project folder (`datathon-2025`) into MAMP's `htdocs` directory:
   ```
   /Applications/MAMP/htdocs/datathon-2025
   ```
2. Start MAMP and ensure Apache is running.
3. Open a web browser and go to:
   ```
   http://localhost/datathon-2025/network_graph.html
   ```

Now, you should be able to see the interactive graph search page. 🚀
