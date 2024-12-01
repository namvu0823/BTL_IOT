document.getElementById('add-user-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    const response = await fetch('/add_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone })
    });

    const data = await response.json();
    if (response.ok) {
        alert('User added successfully: ' + data.user_id);
    } else {
        alert('Error: ' + data.error);
    }
});
