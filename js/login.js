function login(form) {
    console.log("in login")
    const url = "http://localhost:8080/SimpleLibrarySpring/dashboard";
    const un = form.Username.value;
    const pw = form.Password.value;
    console.log("got username and password");
    console.log(un, pw)

    http_request = new XMLHttpRequest();
    http_request.onload = function(xhr) {
        if (xhr.target.status === 200) {
            console.log("got response from server")
            sessionStorage.setItem('username', un);
            sessionStorage.setItem('password', pw);
            window.location.href="dashboard.html";
            const data = JSON.parse(xhr.target.response);
            console.log(data)
        } else {
            console.log('blad');
            console.log(xhr.target.status)
            console.log(xhr.target)
            document.getElementById("badLogin").style.display = "block";
        }
    };

    http_request.open('GET', url, true);
    http_request.setRequestHeader("Authorization", "Basic " + btoa(unescape(encodeURIComponent(un + ":" + pw))));
    http_request.send(null);
}