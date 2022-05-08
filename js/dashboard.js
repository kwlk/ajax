function GetBindData() {

    const url = "http://localhost:8080/SimpleLibrarySpring/dashboard";
    const un = sessionStorage.getItem("username");
    const pw = sessionStorage.getItem("password");

    http_request = new XMLHttpRequest();
    http_request.onload = function(xhr) {
        switch (xhr.target.status){
            case 200:
                var data = JSON.parse(xhr.target.response);
                BindDataToTable(data);
                if (un === "admin") { showAdminDashboard(); }
                break;
            case 401:
                logout();
                break;
            default:
                console.log('blad');
                console.log(xhr.target)
        }
    };

    http_request.open('GET', url, true);
    http_request.setRequestHeader("Authorization", "Basic " + btoa(unescape(encodeURIComponent(un + ":" + pw))));
    http_request.send(null);
}

function BindDataToTable(data)
{
    console.log(data)
    if (data != null && data) {
        var books = '';
        for (var i = 0; i < data.length; i++) {
            const dangerButton = "<td><button type=\"button\" class=\"btn btn-danger deletebtn admin-visible\" " +
                "id='" + data[i].id + "' style=\"display: none\" onclick='deleteBook(" + data[i].id + ")'>X</button></td>";
            var tablerow = "<tr>"
                + "<td>" + data[i].id + "</td>"
                + "<td>" + data[i].title + "</td>"
                + "<td>" + data[i].author + "</td>"
                + "<td>" + data[i].year + "</td>"
                + dangerButton
                + "</tr>";
            books+=tablerow;
        }
        document.getElementById("tblbody").innerHTML = books;
    }
}

function showAdminDashboard()
{
    var adminElements = document.getElementsByClassName("admin-visible");
    for (var i=0; i < adminElements.length; i++) {
        adminElements[i].style.display = "block";
    }
}

function addBook(form)
{
    const t = form.Title.value;
    const a = form.Author.value;
    const y = form.Year.value;
    console.log("got add book data");
    console.log(t, a, y)
    var json = {
        "title": t,
        "author": a,
        "year": y
    };
    console.log(json)

    const url = "http://localhost:8080/SimpleLibrarySpring/dashboard";
    const un = sessionStorage.getItem("username");
    const pw = sessionStorage.getItem("password");

    http_request = new XMLHttpRequest();
    http_request.onload = function(xhr) {
        switch (xhr.target.status){
            case 200:
                var data = JSON.parse(xhr.target.response);
                BindDataToTable(data);
                if (un === "admin") { showAdminDashboard(); }
                break;
            case 401:
                logout();
                break;
            case 500:
                console.log('blad 500');
                console.log(xhr.target)
                var  responseJSON = JSON.parse(xhr.target.responseText);
                var modal = document.getElementById("addBookErrorModal");
                var span = document.getElementsByClassName("close")[0];
                document.getElementById("addBookErrorModal-text").innerHTML = responseJSON.message;
                modal.style.display = "block";
                span.onclick = function() {
                    modal.style.display = "none";
                }
                window.onclick = function(event) {
                    if (event.target === modal) {
                        modal.style.display = "none";
                    }
                }
                GetBindData();
                break;
            default:
                console.log('blad');
                console.log(xhr.target)
        }
    };

    http_request.open('POST', url, true);
    http_request.setRequestHeader("Authorization", "Basic " + btoa(unescape(encodeURIComponent(un + ":" + pw))));
    http_request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    http_request.send(JSON.stringify(json));
}

function deleteBook(id)
{
    console.log("got delete book data");
    console.log(id)

    const url = "http://localhost:8080/SimpleLibrarySpring/dashboard/"+id;
    const un = sessionStorage.getItem("username");
    const pw = sessionStorage.getItem("password");

    http_request = new XMLHttpRequest();
    http_request.onload = function(xhr) {
        if (xhr.target.status == 200) {
            var data = JSON.parse(xhr.target.response);
            GetBindData();
            if (un === "admin") { showAdminDashboard(); }
        } else {
            console.log('blad');
            console.log(xhr.target)
        }
    };

    http_request.open('DELETE', url, true);
    http_request.setRequestHeader("Authorization", "Basic " + btoa(unescape(encodeURIComponent(un + ":" + pw))));
    http_request.send(null);
}

function logout()
{
    console.log("in logout")
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('password');
    window.location.href="login.html";
}