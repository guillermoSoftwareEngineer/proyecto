// app.js

// --------------------------------------------------
// LocalStorage helpers for users
// --------------------------------------------------
function getUsers() {
  return JSON.parse(localStorage.getItem('moveSafeUsers') || '[]');
}
function saveUsers(users) {
  localStorage.setItem('moveSafeUsers', JSON.stringify(users));
}

// --------------------------------------------------
// Register a new user
// Returns true if successful, false if email already exists
// --------------------------------------------------
function registerUser(name, email, pass, role) {
  const users = getUsers();
  if (users.some(u => u.email === email)) {
    return false;
  }
  users.push({ name, email, pass, role });
  saveUsers(users);
  return true;
}

// --------------------------------------------------
// Authenticate a user
// Returns the user object if credentials match, or null otherwise
// --------------------------------------------------
function loginUser(email, pass) {
  const users = getUsers();
  return users.find(u => u.email === email && u.pass === pass) || null;
}

// --------------------------------------------------
// Handle registration form submission
// --------------------------------------------------
const formReg = document.getElementById('form-reg');
if (formReg) {
  formReg.addEventListener('submit', function(e) {
    e.preventDefault();
    const name  = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const pass  = document.getElementById('reg-pass').value;
    const role  = document.getElementById('reg-role').value;

    const ok = registerUser(name, email, pass, role);
    if (ok) {
      alert('Usuario registrado correctamente.');
      formReg.reset();
    } else {
      alert('El correo ya está en uso.');
    }
  });
}

// --------------------------------------------------
// Handle login form submission
// --------------------------------------------------
const formLog = document.getElementById('form-log');
if (formLog) {
  formLog.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('log-email').value.trim();
    const pass  = document.getElementById('log-pass').value;

    const user = loginUser(email, pass);
    if (!user) {
      alert('Credenciales inválidas');
      return;
    }

    // Save session to LocalStorage
    localStorage.setItem('moveSafeSession', JSON.stringify({
      name:  user.name,
      email: user.email,
      role:  user.role
    }));

    // Redirect based on role
    if (user.role === 'administrador') {
      window.location.href = './administracion.html';
    } else {
      window.location.href = './servicios.html';
    }
  });
}
